import psycopg2

class Databases():
    def __init__(self):
        self.db = psycopg2.connect(host='localhost', 
                                   dbname='rasa', 
                                   user='test', 
                                   password='1111', 
                                   port=5432)
        self.cursor = self.db.cursor()

    def __del__(self):
        self.db.close()
        self.cursor.close()
    
    def execute(self, query: str, args: dict = {}) -> list:
        try:
          self.cursor.execute(query, (args))
          rows = self.cursor.fetchall()
        except Exception as e:
          print("Error: ",e)
          rows = []
          
        return rows

    def commit(self):
        self.db.commit()

class CRUD(Databases):
    def insert(self, table: str, colum: str, data: str):
      data = data.split(', ')
      arg = "%s,"*len(data)
      sql = f"INSERT INTO {table} ({colum}) VALUES ({arg[:-1]});"

      try:
         self.cursor.execute(sql, (data))
         self.commit()
      except Exception as e:
         print("Error: ",e)
    
    def read(self, table: str, colum: str, where: str = None) -> list:
      if where:
        sql = f"SELECT {colum} FROM {table} WHERE {where};"
      else:
        sql = f"SELECT {colum} FROM {table};"
      try:
        result = self.execute(sql)
      except Exception as e:
         print("Error: ",e)

      return result
    
    def update(self, table: str, colum: str, value: str, condition: str):
      sql = f"UPDATE {table} SET {colum}=%s WHERE {colum}=%s;"
      try:
         self.execute(sql, (value, condition))
         self.commit()
      except Exception as e:
         print("Error: ",e)
    
    def delete(self, table: str, condition: str):
      sql = f"DELETE FROM {table} WHERE {condition};"
      try:
        self.execute(sql)
        self.commit()
      except Exception as e:
         print("Error: ",e)