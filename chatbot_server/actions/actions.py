from urllib import parse
from dotenv import load_dotenv
from datetime import datetime, date, timedelta, time
import requests, json, os, math
import jwt

from typing import Text, Dict, Any, List

from .db import CRUD

from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from rasa_sdk import Action


load_dotenv()
db = CRUD()

def getBaseTime(base_time):
    base_time_units = {
        "0200": 210,
        "0500": 510,
        "0800": 810,
        "1100": 1110,
        "1400": 1410,
        "1700": 1710,
        "2000": 2010,
        "2300": 2310,
    }
    temp = []

    for time in base_time_units.values():
        temp.append(abs(base_time - time))

    return list(base_time_units.keys())[temp.index(min(temp))]

NX = 149            ## X축 격자점 수
NY = 253            ## Y축 격자점 수

Re = 6371.00877     ##  지도반경 (km)
grid = 5.0          ##  격자간격 (km)
slat1 = 30.0        ##  표준위도 1
slat2 = 60.0        ##  표준위도 2
olng = 126.0        ##  기준점 경도
olat = 38.0         ##  기준점 위도
xo = 210 / grid     ##  기준점 X좌표
yo = 675 / grid     ##  기준점 Y좌표
first = 0

if first == 0 :
    PI = math.asin(1.0) * 2.0
    DEGRAD = PI/ 180.0
    RADDEG = 180.0 / PI

    re = Re / grid
    slat1 = slat1 * DEGRAD
    slat2 = slat2 * DEGRAD
    olng = olng * DEGRAD
    olat = olat * DEGRAD

    sn = math.tan(PI * 0.25 + slat2 * 0.5) / math.tan(PI * 0.25 + slat1 * 0.5)
    sn = math.log(math.cos(slat1) / math.cos(slat2)) / math.log(sn)
    sf = math.tan(PI * 0.25 + slat1 * 0.5)
    sf = math.pow(sf, sn) * math.cos(slat1) / sn
    ro = math.tan(PI * 0.25 + olat * 0.5)
    ro = re * sf / math.pow(ro, sn)
    first = 1

def mapToGrid(lat, lng):
    ra = math.tan(PI * 0.25 + lat * DEGRAD * 0.5)
    ra = re * sf / pow(ra, sn)
    theta = lng * DEGRAD - olng
    if theta > PI :
        theta -= 2.0 * PI
    if theta < -PI :
        theta += 2.0 * PI
    theta *= sn
    x = (ra * math.sin(theta)) + xo
    y = (ro - ra * math.cos(theta)) + yo
    x = int(x + 1.5)
    y = int(y + 1.5)
    return x, y

def geocoding(city):
    url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + city
    key = os.environ.get("RASA_SERVER_KAKAO_API_KEY")
    headers= { "Authorization": f'KakaoAK {key}'}
    api_json = json.loads(str(requests.get(url, headers=headers).text))
    address = api_json['documents'][0]['address']
    crd = {
        "lat": float(address['y']),
        "lng": float(address['x']),
    }

    return crd

def getWeather(city, date):
    weather_api_url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'
    key = os.environ.get("RASA_SERVER_WEATHER_API_URL")
    
    if key is None:
        print("API key is not found.")
        exit(1)

    date = datetime.today()
    base_date = date.strftime('%Y%m%d')
    time = int(date.strftime('%H%M'))
    base_time = getBaseTime(time)
    
    crd = geocoding(city)

    nx, ny = mapToGrid(crd["lat"], crd["lng"])

    params = f'?{parse.quote_plus("ServiceKey")}={key}&' + parse.urlencode({
        parse.quote_plus('numOfRows') : '14',
        parse.quote_plus('pageNo') : '1',
        parse.quote_plus('dataType') : 'JSON',
        parse.quote_plus('base_date') : base_date,
        parse.quote_plus('base_time') : base_time,
        parse.quote_plus('nx') : nx,
        parse.quote_plus('ny') : ny,
    })

    response = requests.get(weather_api_url + params)
    text = response.text
    
    data = json.loads(text)

    return data

def decodeToken(events):
    for event in events:
        if event['event'] == 'user':
            access_token = event['metadata']['access-token']
            access_token = str.replace(str(access_token), 'Bearer ', '')
            decode_token = jwt.decode(access_token, "12314124123", algorithms=["HS256"])
            return decode_token['sub']

def convertToDate(date_str):
    try:
        format = "%Y년%m월%d일"
        if date_str is not None and "월" not in date_str:
            current_month =  datetime.now().month
            copy_date_str = f"{current_month}월{date_str}"
        if date_str is not None and "년" not in date_str:
            current_year =  datetime.now().year
            copy_date_str = f"{current_year}년{copy_date_str}"
        parsed_date = datetime.strptime(copy_date_str, format)
        return parsed_date.date()
    except ValueError:
        print(date_str)
        if date_str == "오늘":
            return date.today()
        elif date_str == "내일":
            return date.today() + timedelta(days=1)
        elif date_str == "내일모래":
            return date.today() + timedelta(days=2)
        else:
            return ValueError("Invalid date format")

def convertToTime(time_str):
    time_parts = time_str.split("시")
    hours = int(time_parts[0])
    if "분" in time_str:
      minutes = int(time_parts[1][:-1])
      return time(hours, minutes)

    return time(hours)

class Weather(Action):
    def name(self) -> Text:
        return "action_wx"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        city = tracker.get_slot('city')
        wx_type = tracker.get_slot('wx_type')
        forecast_period = tracker.get_slot('forecast_period')

        if forecast_period is None:
            forecast_period= "오늘"
        if wx_type is None:
            wx_type = "날씨"
        if city is None:
            city = "서울"
        
        data = getWeather(city, forecast_period)

        if data["response"]["header"]["resultCode"] == '00':
            for item in data["response"]["body"]["items"]["item"]:
                if item["category"] == "POP":
                    pop = item["fcstValue"]
                elif item["category"] == "SKY":
                    sky = int(item["fcstValue"])
                elif item["category"] == "REH":
                    reh = item["fcstValue"]
                elif item["category"] == "TMP":
                    tmp = item["fcstValue"]
                elif item["category"] == "TMX":
                    tmx = item["fcstValue"]
                elif item["category"] == "TMN":
                    tmn = item["fcstValue"]
            if 0 <= sky <= 5:
                sky = "맑음"
            elif 6 <= sky <= 8:
                sky = "구름많음"
            elif 9 <= sky <= 10:
                sky = "흐림"
            result= '현재 온도: {} \n강수확률: {} \n습도: {}\n구름: {}'.format(tmp, pop, reh, sky)
        else:
            result = '오늘과 내일의 날씨만 알 수 있어요. 최대한 빠르게 해당 기능을 고쳐볼게요!'
        dispatcher.utter_message(result)

class ActionGetSchedule(Action):
   def name(self) -> Text:
        return "action_get_schedule"
   def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
       
        events = tracker.current_state()['events']
        user_id = decodeToken(events)

        result = db.read("schedule", "title, start_time, end_time", f"user_id={user_id}")
        
        now = datetime.now()
        upcoming_schedules = [s for s in result if s[1] <= now]
        
        schedule_strs = []
        for schedule in upcoming_schedules:
            start_time = schedule[1].strftime("%H시 %M분")
            event_str = schedule[0].strip()
            schedule_strs.append(f"{start_time}에 {event_str}")

        if schedule_strs:
            result_str = "오늘의 일정은 " + ", ".join(schedule_strs) + "이(가) 예정되어 있습니다."
        else:
            result_str = "오늘은 예정된 일정이 없습니다."

        dispatcher.utter_message(result_str)

class ActionAddSchedule(Action):
   def name(self) -> Text:
        return "action_add_schedule"
   def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        events = tracker.current_state()['events']
        user_id = decodeToken(events)

        date = tracker.get_slot('date')
        time = tracker.get_slot('time')
        title = tracker.get_slot('title')
        
        date_only = convertToDate(date)
        time_only = convertToTime(time)

        combined_datetime = datetime.combine(date_only, time_only)

        try:
            db.insert("schedule", "user_id, title, start_time", f"{user_id}, {title}, {combined_datetime}")
            dispatcher.utter_message(f"{title}을(를) 일정에 추가했습니다.")
        except:
            dispatcher.utter_message("일정 등록에 실패했습니다.")

class ActionsRemoveSchedule(Action):
    def name(self) -> Text:
        return "action_remove_schedule"
    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        events = tracker.current_state()['events']
        user_id = decodeToken(events)
        
        title = tracker.get_slot('title')

        try:
            db.delete("schedule", f"user_id={user_id} AND title='{title}'")
            dispatcher.utter_message(f"일정 {title}을(를) 취소했습니다.")
        except:
            dispatcher.utter_message("일정 취소에 실패했습니다.")