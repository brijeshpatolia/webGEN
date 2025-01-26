import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailcontext';

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div className="p-4 flex justify-between items-center">
      <Image src="/logos.png" alt="logo" width={40} height={40} />
      {!userDetail?.name && ( // Safely check if userDetail exists and has a name
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            style={{
              backgroundColor: '#259BFE',
              color: '#fff',
            }}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
