"use client";

import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import MapClient from "./MapClient"
import CopyButton from "./CopyButton"
import { useClickTracking } from '@/lib/useClickTracking'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [footerData, setFooterData] = useState({})
  const [headerData, setHeaderData] = useState({})
  const [whitelogo, setWhitelogo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  
  // Click tracking hook
  const { trackEvent } = useClickTracking()

  // Fetch footer data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const [footerResponse, headerResponse, logoResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/footer/getFooter`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/header/getHeader`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logo/footerwhite`, {
            cache: 'no-store',
          }),
        ])

        const footerData = footerResponse.ok ? await footerResponse.json() : {}
        const headerData = headerResponse.ok ? await headerResponse.json() : {}
        const logoData = logoResponse.ok ? await logoResponse.json() : null

        setFooterData(footerData)
        setHeaderData(headerData)
        setWhitelogo(logoData)
      } catch (error) {
        console.error("Error fetching footer data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Track link clicks
  const handleLinkClick = (linkName, href) => {
    trackEvent('button_click', {
      buttonName: `footer_link_${linkName}`,
      metadata: {
        linkName: linkName,
        href: href,
        section: 'footer',
        linkType: 'navigation'
      }
    })
  }

  // Track contact clicks
  const handleContactClick = (contactType, value) => {
    trackEvent('button_click', {
      buttonName: `footer_contact_${contactType}`,
      metadata: {
        contactType: contactType,
        value: value,
        section: 'footer',
        action: 'contact_initiated'
      }
    })
  }

  // Track logo click
  const handleLogoClick = () => {
    trackEvent('button_click', {
      buttonName: 'footer_logo',
      metadata: {
        section: 'footer',
        action: 'navigate_home'
      }
    })
  }

  // Track external link clicks
  const handleExternalLinkClick = (linkName, href) => {
    trackEvent('button_click', {
      buttonName: `footer_external_${linkName}`,
      metadata: {
        linkName: linkName,
        href: href,
        section: 'footer',
        linkType: 'external'
      }
    })
  }

  // Track copy button clicks (to be passed to CopyButton component)
  const handleCopyClick = (contentType, value) => {
    trackEvent('button_click', {
      buttonName: `footer_copy_${contentType}`,
      metadata: {
        contentType: contentType,
        value: value,
        section: 'footer',
        action: 'copied_to_clipboard'
      }
    })
  }

  if (isLoading) {
    return (
      <footer className="bg-gray-100 text-gray-800 pt-12 pb-8 lg:px-5 xl:px-10">
        <div className="px-4 md:px-5">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-100 text-gray-800 pt-12 pb-8 lg:px-5 xl:px-10">
      <div className="px-4 md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 sm:gap-16 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <Link href="/" onClick={handleLogoClick}>
              {whitelogo ? (
                <div className="relative w-1/2 md:w-[10cm] h-16">
                  <Image
                    src={`/api/logo/download/${whitelogo.photo}`}
                    alt={whitelogo.alt || "Logo"}
                    title={whitelogo.imgTitle || "Company Logo"}
                    width={250}
                    height={100}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Logo unavailable</p>
              )}
            </Link>
            <p className="sm:mt-6 text-sm md:text-md text-[#bf2e2e] font-semibold">
              "{footerData.description || "Company description goes here."}"
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h5 className="text-lg font-bold mb-6 text-gray-800 border-b w-fit  xl:w-full pb-2">Useful Links</h5>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about-us" 
                  className="hover:text-[#bf2e2e]"
                  onClick={() => handleLinkClick('about_us', '/about-us')}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link 
                  href="/blogs" 
                  className="hover:text-[#bf2e2e]"
                  onClick={() => handleLinkClick('blogs', '/blogs')}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact-us" 
                  className="hover:text-[#bf2e2e]"
                  onClick={() => handleLinkClick('contact_us', '/contact-us')}
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2">
            <h5 className="text-lg font-bold  text-gray-800 border-b w-fit xl:w-full pb-2">Our Offices</h5>
            <div className="">
               {/* Corporate Office */}
              <div className="  py-4 rounded-lg  border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className=" rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-[#bf2e2e]" />
                  </div>
                  <h6 className="font-bold text-[#bf2e2e] text-base">Corporate Office</h6>
                </div>
                <div className="pl-11">
                  <address className="not-italic text-gray-700 leading-relaxed">
                    <p className="font-medium">{footerData.CorporateAddress}</p>
                  </address>
                </div>
              </div>

              {/* Sales Office */}
              <div className=" py-4 rounded-lg  border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className=" rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-[#bf2e2e]" />
                  </div>
                  <h6 className="font-bold text-[#bf2e2e] text-base">Sales Office</h6>
                </div>
                <div className="pl-11">
                  <address className="not-italic text-gray-700 leading-relaxed">
                    <p className="font-medium">{footerData.SalesAddress}</p>
                  </address>
                </div>
              </div>

              {/* Factory Address */}
              <div className=" py-4 rounded-lg  border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="  rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-[#bf2e2e]" />
                  </div>
                  <h6 className="font-bold text-[#bf2e2e] text-base">Factory</h6>
                </div>
                <div className="pl-11">
                  <p className="text-gray-700 leading-relaxed">
                    {footerData.FactoryAddress || "Company Address"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Location Map */}
          <div className="col-span-2">
          <div className="">
            <h3 className="text-lg font-bold mb-6 text-gray-800 border-b w-fit xl:w-full pb-2">Contact Info</h3>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center  group">
                  <a 
                    href={`tel:${footerData.phoneNo}`} 
                    className="hover:text-[#bf2e2e] flex items-center flex-1"
                    onClick={() => handleContactClick('phone', footerData.phoneNo)}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{footerData.phoneNo || "N/A"}</span>
                  </a>
                  <CopyButton 
                    textToCopy={footerData.phoneNo || ''} 
                    ariaLabel="Copy phone number"
                    onCopy={() => handleCopyClick('phone', footerData.phoneNo)}
                  />
                </div>
              </li>
              <li>
                <div className="flex items-center group">
                  <a 
                    href={`mailto:${footerData.email}`} 
                    className="hover:text-[#bf2e2e] flex items-center flex-1"
                    onClick={() => handleContactClick('email', footerData.email)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{footerData.email || "N/A"}</span>
                  </a>
                  <CopyButton 
                    textToCopy={footerData.email || ''} 
                    ariaLabel="Copy email"
                    onCopy={() => handleCopyClick('email', footerData.email)}
                  />
                </div>
              </li>
              {footerData.email2 && (
                <li>
                  <div className="flex items-center group">
                    <a 
                      href={`mailto:${footerData.email2}`} 
                      className="hover:text-[#bf2e2e] flex items-center flex-1"
                      onClick={() => handleContactClick('email2', footerData.email2)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      <span>{footerData.email2}</span>
                    </a>
                    <CopyButton 
                      textToCopy={footerData.email2} 
                      ariaLabel="Copy secondary email"
                      onCopy={() => handleCopyClick('email2', footerData.email2)}
                    />
                  </div>
                </li>
              )}
            </ul>
          </div>
            <h5 className="text-lg font-bold mb-6 text-gray-800 border-b w-fit xl:w-full mt-5 pb-2">Location</h5>
            <div className="aspect-video">
              <MapClient location={footerData.location} />
            </div>
            <div className="flex justify-between items-center space-x-4 float-end max-w-5xl text-gray-500 mt-6 text-sm space-y-2">
              <Link 
                href="/privacy-policy" 
                className="hover:text-gray-700 pt-1 sm:pt-0"
                onClick={() => handleLinkClick('privacy_policy', '/privacy-policy')}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-and-conditions" 
                className="hover:text-gray-700"
                onClick={() => handleLinkClick('terms_conditions', '/terms-and-conditions')}
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        

        {/* Copyright */}
        <div className="text-gray-500 font-semibold mt-8 text-center sm:pt-10">
          <p>
            Copyright {currentYear}{" "}
            <Link 
              href="/"
              onClick={handleLogoClick}
            >
              <span className="text-[#bf2e2e]">Apurva Chemicals Pvt. Ltd.</span>
            </Link>{" "}
            All Rights Reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            Designed & Developed by{" "}
            <a
              href="https://rndtechnosoft.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bf2e2e] font-bold hover:underline"
              onClick={() => handleExternalLinkClick('rnd_technosoft', 'https://rndtechnosoft.com/')}
            >
              RnD Technosoft
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}