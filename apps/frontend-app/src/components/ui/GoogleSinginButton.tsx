import {ReactNode} from 'react'
import { Button } from './button'




interface Props{
children:ReactNode

}


const GoogleSinginButton = ({children}:Props) => {

    const loginWithGoogle=()=>console.log("loginWithGoogle")
  return (
    <Button    onCLick={loginWithGoogle}className="w-full bg-amber-50 text-black font-semibold hover:bg-amber-50">
{children}
    </Button>
  )
}

export default GoogleSinginButton