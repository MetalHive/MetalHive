import React from 'react'
import Link from 'next/link'
const Companies = () => {
  return (
    <div className='bg-[#17181A] text-white text-center py-10 px-10'>
<h2 className='text-4xl font-medium mb-10'>
    The world's best companies shop at Metal Hive
</h2>
  <Link href={"/auth"} className='bg-white text-black text-lg font-semibold p-4 rounded-xl border-4 mt-5 outline-none'>
    View marketplace
</Link>
    </div>
  )
}

export default Companies