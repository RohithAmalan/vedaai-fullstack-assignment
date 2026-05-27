'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function SettingsPage() {
  const { schoolName, schoolAddress, setSchoolName, setSchoolAddress } = useSettingsStore();

  return (
    <div className="flex min-h-screen w-full bg-[#EBEBEB] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="Settings" />

        <main className="flex-1 p-6 lg:p-8 pb-32">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">School Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">School Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-[14px] outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">School Address / Branch</label>
                  <input
                    type="text"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="e.g. Bokaro Steel City"
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-[14px] outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-2">This will appear on the top of the generated question paper.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
