import { 
  style, 
  globalStyle, 
  createTheme,
  keyframes
} from "@vanilla-extract/css";

globalStyle('body', {
  margin: 0,
})

const piece1 = keyframes({
  '0%': { top: '-3px' },
  '50%': { top: '3px' },
  '100%': { top: '-3px' }
})

export const [ themeClass, vars ] = createTheme({
  color: {
    bg: '#211F57',
    item: '#8061FA'
  },
  font: {
    size: {
      small: '16px',
      big: '28px'
    }
  }
})

export const root = style({
  backgroundColor: vars.color.bg,
  width: '100%',
  height: '100vh'
})

export const footer = style({
  position: 'relative',

  width: '100%',
  height: '20%'
})

export const mikeBase = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

export const circleContainer = style([mikeBase, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  width: '60px',
  height: '80px'
}])

globalStyle(`${circleContainer} > div:nth-child(n)`, {
  position: 'relative',

  animationName: piece1,
  animationDuration: '0.85s',
  animationIterationCount: 'infinite'
})

globalStyle(`${circleContainer} > div:nth-child(1)`, {
  animationDelay: '0.15s',
})

globalStyle(`${circleContainer} > div:nth-child(2)`, {
  animationDelay: '0.30s',
})

globalStyle(`${circleContainer} > div:nth-child(3)`, {
  animationDelay: '0.45s',
})

export const responseContainer = style({
  display: 'flex',
  justifyContent: 'center'
})

export const text = style({
  color: 'white',

  fontSize: vars.font.size.big
})

export const answerText = style({
  color: 'white',
  
  fontSize: vars.font.size.small
})

export const mickButton = style([mikeBase, {
  cursor: 'pointer',
  
  background: 'inherit',
  border: '2px solid white',
  borderRadius: '50%',
  
  width: '80px',
  height: '80px'
}])

export const robot = style({
  width: '100%',
  height: '80%',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

export const circle = style({
  width: '10px',
  height: '10px',

  background: "white",
  border: 'none',
  borderRadius: '50%',
})

export const answer = style({
  position: 'absolute',
  top: '20%',
  left: '60%',

  maxWidth: '400px',
  padding: '10px',

  background: vars.color.item,
  borderRadius: '5px',

  ':after': {
    content: "",

    borderTop: `10px solid ${vars.color.item}`,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid transparent',

    position: 'absolute',
    top: '98%',
    left: '0%',

  }
})

export const form = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
})

export const inputContainer = style({
  position: 'relative',
  display: 'table',
  textAlign: 'left',

  width: '402px',
  height: '48px',

  boxSizing: 'border-box',
  border: '1px solid #dadada',
  borderRadius: '6px 6px 0 0',
  background: 'white',

  padding: '14px 17px 13px',
  marginBottom: '8px'
})

export const label = style({
  display: 'table-cell',
  width: '16px',
  height: '16px'
})

export const input = style({
  cursor: 'pointer',

  width: '100%',
  height: '19px',
  lineHeight: '19px',

  marginLeft: '8px',

  fontSize: '16px',
  fontWeight: 400,

  border: 'none',
  outline: 'none'
})

export const button = style({
  cursor: 'pointer',

  display: 'block',

  borderRadius: '6px',
  border: `1px solid ${vars.color.item}`,
  backgroundColor: vars.color.item,
  color: 'white',

  boxSizing: 'border-box',

  marginTop: '24px',

  width: '402px',
  height: '46px',

  fontFamily: 'Noto Sans KR',
  fontStyle: 'normal',
  fontWeight: '800',
  fontSize: '18px',
})

export const h2 = style({
  fontSize: '32px',
  fontWeight: 800,
  color: 'white'
})

export const ul = style({
  padding: '20px 0',
  textAlign: 'center',

  listStyle: 'none',
})

export const li = style({
  position: 'relative',
  display: 'inline-block',

  selectors: {
    '&:not(:first-child)': {
      paddingLeft: '28px'
    },
    '&:not(:first-child)::before': {
      content: '',

      position: 'absolute',
      top: '3px',
      left: '12px',

      width: '1px',
      height: '12px',

      borderRadius: '0.5px',
      backgroundColor: '#dadada'
    }
  }
})

export const link = style({
  display: 'inline-block',
  fontSize: '14px',
  lineHeight: '17px',

  textDecoration: 'none',
  color: 'white'
})