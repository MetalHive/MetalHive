"use client"
import  { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/navigation";
const Membership = () => {
  const [selected, setSelected] = useState('') // 'sell' or 'buy'
const router = useRouter()
  const handleSelect = (type:string) => {
    setSelected(type)
    console.log(selected); 
  }
  const handleClick = () => {
   router.push(`/auth/${selected}`); 
  };


  return (
    <div className="px-4 py-10">
      {/* Logo */}
      <Image
        src="/logoBlack.png"
        width={90}
        height={90}
        alt="MetalHive black logo"
      />
      <div className='flex flex-col items-center'>
      <div className="flex flex-col items-center mt-10  gap-8 w-full">
        {/* Heading */}
        <div className="flex flex-col w-full md:w-[590px] gap-4 text-center">
          <h2 className="text-2xl font-semibold">What Would You Like to Do?</h2>
          <p className="text-[#666666]">
            Choose what you’d like to do on our platform so we can tailor your experience just for you.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-[700px]">
          <div
            onClick={() => handleSelect('sell')}
            className={`flex flex-col w-full max-w-[325px] pt-8 pb-9 px-6 gap-5 border rounded-lg cursor-pointer transition
              ${selected === 'sell' ? 'bg-[#C9A22708] border-[#C9A227]' : 'border-[#E0E0E0]'}`}
          >
            <h2 className="font-semibold text-xl">Sell scrap metals</h2>
            <p className="text-[#666666] ">
              List your materials and get offers from verified companies.
            </p>
          </div>

          <div
            onClick={() => handleSelect('buy')}
            className={`flex flex-col w-full max-w-[325px] pt-8 pb-9 px-6 gap-5 border rounded-lg cursor-pointer transition
              ${selected === 'buy' ? 'bg-[#C9A22708] border-[#C9A227]' : 'border-[#E0E0E0]'}`}
          >
            <h2 className="font-semibold text-xl">Buy scrap metals</h2>
            <p className="text-[#666666]">
              Find trusted sellers and place secure bids on verified listings.
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          disabled={!selected}
          onClick={handleClick}
          className={`relative bg-[#C9A227] text-white font-semibold px-6 py-3 rounded-lg w-full md:w-40 transition
            ${!selected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-[#C9A227]'}`}
        >
          Continue
        </button>

        {/* Sign in link */}
        <p className="text-sm text-[#666666] mt-2">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#C9A227] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Membership
