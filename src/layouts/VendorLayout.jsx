import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const VendorLayout = () => {
  return (
    <>
      <Navbar role="vendor" />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default VendorLayout;
