import Image from 'next/image';
import logo from '~/public/logo.png';

export const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen animate-spin'>
      <Image src={logo} alt='logo' width={72} height={72} />
    </div>
  );
};
