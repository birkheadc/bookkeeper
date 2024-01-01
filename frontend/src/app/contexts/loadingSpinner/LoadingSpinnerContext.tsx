import * as React from 'react';
import ReactModal from 'react-modal';
import LoadingSpinner from './LoadingSpinner';
import { randomUUID } from 'crypto';

type Props = {
  children: React.ReactNode
}

type State = {
  isLoading: boolean,
  useLoading: (action: Function) => void
}

export const LoadingSpinnerContext = React.createContext<State>({ isLoading: false, useLoading: () => {} });
export const LoadingSpinnerProvider = ({ children }: Props) => {
  const [ numLoading, setNumLoading ] = React.useState<number>(0);
  const isLoading = numLoading > 0;

  const useLoading = async (action: Function) => {
    setNumLoading(n => n + 1);
    try {
      await action();
    } catch {

    } finally {
      setNumLoading(n => n - 1);
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