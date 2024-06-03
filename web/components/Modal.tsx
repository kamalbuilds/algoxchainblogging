export default function Modal({ onClose, children }: any) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-3xl m-auto flex-col flex rounded-lg shadow-lg">
          <h3 className="font-bold text-gray-800">
          Support your creator cross-chain with SolQuill 🪶🚀
        </h3>
            {children}
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
    );
}


{/* <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-modal">
  Vertically centered modal
</button>

<div id="hs-vertically-centered-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
  <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
    <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
      <div className="flex justify-between items-center py-3 px-4 border-b">
        <h3 className="font-bold text-gray-800">
          Modal title
        </h3>
        <button type="button" className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-modal">
          <span className="sr-only">Close</span>
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        <p className="text-gray-800">
          This is a wider card with supporting text below as a natural lead-in to additional content.
        </p>
      </div>
      <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-modal">
          Close
        </button>
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          Save changes
        </button>
      </div>
    </div>
  </div>
</div>

<button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-scrollable-modal">
  Vertically centered scrollable modal
</button>

<div id="hs-vertically-centered-scrollable-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
  <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
    <div className="w-full max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
      <div className="flex justify-between items-center py-3 px-4 border-b">
        <h3 className="font-bold text-gray-800">
          Modal title
        </h3>
        <button type="button" className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-scrollable-modal">
          <span className="sr-only">Close</span>
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Be bold</h3>
            <p className="mt-1 text-gray-800">
              Motivate teams to do their best work. Offer best practices to get users going in the right direction. Be bold and offer just enough help to get the work started, and then get out of the way. Give accurate information so users can make educated decisions. Know your user's struggles and desired outcomes and give just enough information to let them get where they need to go.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Be optimistic</h3>
            <p className="mt-1 text-gray-800">
              Focusing on the details gives people confidence in our products. Weave a consistent story across our fabric and be diligent about vocabulary across all messaging by being brand conscious across products to create a seamless flow across all the things. Let people know that they can jump in and start working expecting to find a dependable experience across all the things. Keep teams in the loop about what is happening by informing them of relevant features, products and opportunities for success. Be on the journey with them and highlight the key points that will help them the most - right now. Be in the moment by focusing attention on the important bits first.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Be practical, with a wink</h3>
            <p className="mt-1 text-gray-800">
              Keep our own story short and give teams just enough to get moving. Get to the point and be direct. Be concise - we tell the story of how we can help, but we do it directly and with purpose. Be on the lookout for opportunities and be quick to offer a helping hand. At the same time realize that novbody likes a nosy neighbor. Give the user just enough to know that something awesome is around the corner and then get out of the way. Write clear, accurate, and concise text that makes interfaces more usable and consistent - and builds trust. We strive to write text that is understandable by anyone, anywhere, regardless of their culture or language so that everyone feels they are part of the team.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-scrollable-modal">
          Close
        </button>
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          Save changes
        </button>
      </div>
    </div>
  </div>
</div> */}