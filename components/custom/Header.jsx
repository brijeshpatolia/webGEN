import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Ghost } from 'lucide-react'

const Header = () => {
  return (
    <div className='p-4 flex justify-between items-center'>
        <Image src="/logos.png" alt="logo" width={40} height={40} />
        <div className='flex gap-5'>
            <Button variant = "ghost">Sign In</Button>
            <Button style = {
                {
                    backgroundColor: '#259BFE',
                    color: '#fff'
                }
            }>Get Started</Button>
        </div>
    </div>
  )
}

export default Header