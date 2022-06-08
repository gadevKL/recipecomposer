import React, { useState } from "react";
import { Button, Stack } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import HamburgerMenu from "react-hamburger-menu";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import logo from '../cook.svg';

import Content from './Content';

const Home = () => {
  // const [startDate, setStartDate] = useState(new Date());
  // startDate.setHours(0, 0, 0, 0);
  const [con, setCon] = useState('O')
  // console.log(con)

  const [drawer, setDrawer] = useState(false)
  const handleClick = () => { setDrawer(prevDrawer => !prevDrawer) }

  const navDisp = (c) => {
    if (c === 'O') {
      return "Recipe Composer"
    }
    else { return "SmartCooker Dashboard" }
  }

  return (
    <div>
      <Navbar bg="light">
        <Navbar.Brand>
          <div className='d-inline-block align-center ms-4 me-2'>
            <HamburgerMenu isOpen={drawer}
              menuClicked={handleClick}
              width={20}
              height={15}
              strokeWidth={2}
              rotate={0}
              color='black'
              borderRadius={12}
              animationDuration={0.75}
              className="pointHover"
            />
          </div>
          <img
            src={logo}
            width="24"
            height="24"
            className="d-inline-block align-center ms-3 me-2"
            alt='GA logo'
          />
          <h5 className="pt-1 d-inline-block align-top">{navDisp(con)}</h5>
        </Navbar.Brand>
      </Navbar>



      <Drawer open={drawer} onClose={handleClick} direction='left' duration='450' size={345}>
        <div className="m-4 qs">

          <Stack direction="horizontal" gap={2}>
            <img
              src={logo}
              width="24"
              height="24"
              className=" align-center"
              alt='GA logo'
            />
            <h5 className="mt-1 pt-1">SmartCooker Dashboard</h5>
            <div className='ms-auto pointHover'>
              <HamburgerMenu
                isOpen={drawer}
                menuClicked={handleClick}
                width={20}
                height={15}
                strokeWidth={2}
                color='black'
                borderRadius={12}
                animationDuration={0.3}
              />
            </div>
          </Stack>



          <div className="d-grid gap-2 ">
            <Button className="mt-4 btn-block text-start" variant="light" size="md" onClick={() => { setCon('O'); setDrawer(false) }}>
              <span className="me-2  text-left">🍲</span> Recipe Composer
            </Button>
            <Button className="my-2 btn-block text-start" variant="light" size="md" onClick={() => { setCon('T'); setDrawer(false) }}>
              <span className="me-2">📊</span> Chart
            </Button>
            <Button className="my-2 btn-block text-start" variant="light" size="md" onClick={() => { setCon('F'); setDrawer(false) }}>
              <span className="me-2">☑</span>Result Audit
            </Button>
          </div>

          <div className="px-4 py-4 fixed-bottom qsl">by GoAutomate</div>
        </div>
      </Drawer>

      <Content content={con} />

      {/* <Offcanvas show={drawer} onHide={handleClick}>

        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="qs">

              <img
                src={logo}
                width="32"
                height="32"
                className="d-inline-block me-1 align-center pointHover"
                alt='GA logo'
              />
              <h6 className="d-inline-block me-5">Dashboard Menu</h6>

            </div>


          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="d-grid gap-2 ">
            <Button className="mt-4 btn-block text-start" variant="light" size="md" onClick={() => { setCon('O'); setDrawer(false) }}>
              <span className="me-2  text-left">🍲</span> Recipe Composer
            </Button>
            <Button className="my-2 btn-block text-start" variant="light" size="md" onClick={() => { setCon('T'); setDrawer(false) }}>
              <span className="me-2">📊</span> Chart
            </Button>
            <Button className="my-2 btn-block text-start" variant="light" size="md" onClick={() => { setCon('F'); setDrawer(false) }}>
              <span className="me-2">☑</span>Result Audit
            </Button>
          </div>

          <div className="px-4 py-4 fixed-bottom qsl">by GoAutomate</div>
        </Offcanvas.Body>


      </Offcanvas> */}

    </div >

  );
};

export default Home;