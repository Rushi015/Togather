import {ReactNode} from 'react'


interface Props{
    children:ReactNode
}
const AuthLayout = ({ children }: Props) => {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-gray-900 to-black">
        {/* Heading */}
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-lg p-6">
          Welcome to NeoGather
        </h1>
  
        {/* Auth Box */}
        <div className="bg-zinc-800/70 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-xl border border-zinc-600/50 w-[85%] max-w-md text-white transition-transform duration-300 hover:scale-[1.02]">
          {children}
        </div>
      </div>
    );
  };
  
  export default AuthLayout;
  
  
 
  

