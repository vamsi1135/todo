import React, { Fragment, ReactNode } from 'react';

import { Dialog, Transition } from '@headlessui/react';

type IMainProps = {
  children: ReactNode;
  open: boolean;
  hideCloseButton?: boolean;
  position?: string;
  theme?: string;
  noPadding?: boolean;
  disableOutsideClick?: boolean;
  fullScreen?: boolean;
  maxWidthClass?: string;
  setOpen: (open: boolean) => void;
};

const Modal = ({
  children,
  open,
  hideCloseButton = false,
  setOpen,
  noPadding,
  maxWidthClass,
  disableOutsideClick = false,
  fullScreen = false,
  position = 'center',
  theme = 'light',
}: IMainProps) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog
      as="div"
      auto-reopen="true"
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 100 }}
      onClose={(e) => {
        if (!disableOutsideClick) setOpen(e);
      }}
    >
      <div
        className={`flex items-end justify-center min-h-screen ${
          noPadding ? '' : 'pt-4 px-4 pb-20'
        } text-center sm:block sm:p-0 ${position === 'top' ? 'relative -top-20 sm:-top-40' : ''}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            className={`inline-block align-bottom bg-white rounded-lg ${
              noPadding ? '' : 'px-4 pt-5 pb-4 sm:p-6'
            } text-left shadow-xl transform transition-all sm:my-8 sm:align-middle  ${
              fullScreen ? 'w-[90%] h-[90vh] overflow-y-auto' : 'max-w-3xl sm:w-full'
            } sm:${maxWidthClass || !fullScreen ? `${maxWidthClass}` : ''}`}
          >
            {!hideCloseButton && (
              <button
                type="button"
                className={`flex absolute right-3 top-3 cursor-pointer z-50 ${
                  theme === 'dark' ? 'text-white' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {children}
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

// export {Modal};
// export {Modal};
export {Modal};
