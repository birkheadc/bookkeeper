import * as React from 'react';
import ReactModal from 'react-modal';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  children: React.ReactNode
}

type LoadingSpinnerType = {
  isLoading: boolean,
  useLoading<T>(action: () => Promise<T>): Promise<T>
}

const DEFAULT_LOADING_SPINNER_TYPE: LoadingSpinnerType = {
  isLoading: false,
  useLoading: function <T>(action: () => Promise<T>): Promise<T> {
    throw new Error('Function not implemented.');
  }
}

export const LoadingSpinnerContext = React.createContext<LoadingSpinnerType>(DEFAULT_LOADING_SPINNER_TYPE);
export const LoadingSpinnerProvider = ({ children }: Props) => {
  const [ numLoading, setNumLoading ] = React.useState<number>(0);
  const isLoading = numLoading > 0;

  async function useLoading<T>(action: () => Promise<T>): Promise<T> {
    setNumLoading(n => n + 1);
    try {
      return await action();
    } catch (err) {
      throw err;
    } finally {
      setNumLoading(n => (Math.max(0, n - 1)));
    }
  }
  
  return (
    <LoadingSpinnerContext.Provider value={{ isLoading, useLoading }}>
      <ReactModal className={'loading-spinner-modal-wrapper'} isOpen={isLoading}>
        <LoadingSpinner />
      </ReactModal>
      { children }
    </LoadingSpinnerContext.Provider>
  )
}