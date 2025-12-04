// 'use client';

// import { useState } from 'react';
// import { FEATURED_EVENTS } from '@/lib/constants';
// import { Check, ChevronDown } from 'lucide-react';
// import { Theme } from '@/lib/types';

//     interface PageProps {
//         pageId?: string;
//         theme?: Theme;
//         setTheme?: (theme: Theme) => void;
//     }

//     interface Page {
//         id: string;
//         name: string;
//         type: string;
//         followers: number;
//         discription: string;
//     }

// export default function Page({ pageId, theme, setTheme }: PageProps) {
//     const [myPages, setMyPages] = useState<Page[]>([]);
//     const [events] = useState(FEATURED_EVENTS);
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [isMoreCatOpen, setIsMoreCatOpen] = useState(false);

//     const ALL_CATEGORIES = ['All', 'Music', 'Tech', 'Art', 'Gaming'];
//     const visibleCategories = ALL_CATEGORIES.slice(0, 3);
//     const hiddenCategories = ALL_CATEGORIES.filter(c => !visibleCategories.includes(c));

//     const handleCategorySelect = (cat: string) => {
//     setSelectedCategory(cat);
//     setIsMoreCatOpen(false);
//     };

//     return (
//     <div className="flex-1 p-6 max-w-7xl mx-auto">
//         {/* My Pages + Subscribe Button */}
//         <div className="mb-8 border-b pb-6">
//         <h2 className="text-lg font-semibold mb-4">My Pages</h2>

//         {myPages.length > 0 ? (
//         <div className="flex flex-wrap gap-3 mb-4">
//             {myPages.map(page => (
//             <div
//                 key={page.id}
//                 className="p-3 border rounded bg-gray-50 dark:bg-[#111] flex-1 min-w-[150px]"
//             >
//                 <h4 className="font-medium">{page.name}</h4>
//                 <p className="text-sm text-gray-500 dark:text-gray-300">
//                 {page.discription} discription
//                 </p>
//             </div>
//             ))}
//         </div>
//         ) : (
//         <p className="text-gray-500 dark:text-gray-400 mb-4">
//             You don't have your own page yet
//         </p>
//         )}

//         <button
//         onClick={() => null } // Thay bằng hàm tạo page
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//         Create a Page
//         </button>
//         </div>

//         {/* Category Filter */}
//         <div className="flex gap-3 mb-6">
//         {visibleCategories.map(cat => (
//             <button
//             key={cat}
//             onClick={() => setSelectedCategory(cat)}
//             className={`px-3 py-1 rounded text-sm ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 dark:bg-white/5'}`}
//             >
//             {cat}
//             </button>
//         ))}

//         <div className="relative">
//             <button
//             onClick={() => setIsMoreCatOpen(!isMoreCatOpen)}
//             className="px-3 py-1 rounded bg-gray-100 dark:bg-white/5 flex items-center gap-1"
//             >
//             More <ChevronDown size={14} />
//             </button>
//             {isMoreCatOpen && (
//             <div className="absolute top-full mt-2 w-36 bg-white dark:bg-[#1a1a1a] border rounded shadow">
//                 {hiddenCategories.map(cat => (
//                 <button
//                     key={cat}
//                     onClick={() => handleCategorySelect(cat)}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 flex justify-between items-center"
//                 >
//                     {cat}
//                     {selectedCategory === cat && <Check size={14} className="float-right" />}
//                 </button>
//                 ))}
//             </div>
//             )}
//         </div>
//         </div>

//         {/* Events */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map((event, idx) => (
//             <div key={idx} className="p-4 border rounded shadow-sm bg-white dark:bg-[#0a0a0a]">
//             <h3 className="font-semibold">{event.title}</h3>
//             <p className="text-sm text-gray-500 dark:text-gray-300">{event.date}</p>
//             </div>
//         ))}
//         </div>
//     </div>
//     );
// }
'use client';

import { useState, useEffect } from 'react';
import axios, { endpoints, authApis } from '@/lib/APIs';
import { Theme } from '@/lib/types';

interface PageProps {
  pageId?: string;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

interface Page {
  uuid: string;
  name: string;
  pageType: string;
  description: string;
  followerCount: number;
  coverImageUrl: string;
  avatarUrl: string;
}

export default function Page({ pageId, theme, setTheme }: PageProps) {
  const [myPages, setMyPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 10;

  const fetchPages = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(endpoints.pages, {
        params: { page, size: PAGE_SIZE },
      });
      setMyPages(res.data.content); // backend trả về { content, totalPages, ... }
      setTotalPages(res.data.totalPages);
      setPageNumber(res.data.number);
    } catch (error) {
      console.error("Failed to fetch pages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages(0);
  }, []);

  const handleNext = () => {
    if (pageNumber + 1 < totalPages) fetchPages(pageNumber + 1);
  };

  const handlePrev = () => {
    if (pageNumber > 0) fetchPages(pageNumber - 1);
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">My Pages</h2>

      {loading ? (
        <p>Loading pages...</p>
      ) : myPages.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {myPages.map(page => (
              <div
                key={page.uuid}
                className="p-4 border rounded shadow-sm bg-white dark:bg-[#111]"
              >
                <img
                  src={page.coverImageUrl}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={page.avatarUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900"
                  />
                  <h4 className="font-medium">{page.name}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {page.description}
                </p>
                <p className="text-xs text-gray-400">
                  Followers: {page.followerCount}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={pageNumber === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {pageNumber + 1} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={pageNumber + 1 >= totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>You don't have your own page yet.</p>
      )}
    </div>
  );
}
