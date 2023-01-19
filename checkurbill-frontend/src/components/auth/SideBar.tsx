import { Sidebar } from 'flowbite-react'
import React from 'react'
import InsertChartIcon from '@mui/icons-material/InsertChart';
import StoreIcon from '@mui/icons-material/Store';
type Props = {
  collapse: boolean
}

const SideBar = ({collapse}: Props) => {
  return (
    <>
        {/* <div className="w-fit max-h-screen sticky top-0"> */}
        {/* ${collapse ? 'w-[75px]' : 'w-fit'} */}
        <div id="drawer-example" className={`w-[75px] md:w-fit max-h-screen sticky top-0 p-4 overflow-y-auto bg-white dark:bg-gray-800
         overflow-x-hidden duration-300`} tabIndex={-1}  aria-labelledby="drawer-label">
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
                <Sidebar.Items className='mt-6'>
                  <Sidebar.ItemGroup>
                      <Sidebar.Item href="#" className='w-[180px] truncate md:text-clip' icon={InsertChartIcon} >
                          Dashboard
                      </Sidebar.Item>
                      <Sidebar.Item href="#" className='w-[180px] truncate md:text-clip' icon={StoreIcon} >
                          Merchants
                      </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
          </div>
        {/* </div> */}
    </>
  )
}

export default SideBar