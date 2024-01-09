import * as React from 'react';
import ReactModal from 'react-modal';
import Calculator from './Calculator';
import { SettingsContext } from '../settings/SettingsContext';

type Props = {
  children: React.ReactNode
}

type Data = {
  useCalculator: (prev: number, f: (n: number) => void) => Promise<void>
}

const DEFAULT_DATA: Data = {
  useCalculator: function (prev: number, f: (n: number) => void): Promise<void> {
    throw new Error('Function not implemented.');
  }
}

export const CalculatorContext = React.createContext<Data>(DEFAULT_DATA);
export const CalculatorProvider = ({ children }: Props) => {  
  const [ isOpen, setOpen ] = React.useState<boolean>(false);
  const [ prev, setPrev ] = React.useState<number>(0);

  const [ callback, setCallback ] = React.useState<(n: number) => void>(() => (n: number) => {});

  const useCalculator = async (prev: number, f: (n: number) => void) => {
    setOpen(true);
    setPrev(prev);
    setCallback(() => f);
  }

  const handleSubmit = (n: number) => {
    setOpen(false);
    if (callback) callback(n);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <CalculatorContext.Provider value={{ useCalculator }}>
      <ReactModal preventScroll={true} shouldCloseOnEsc isOpen={isOpen} onRequestClose={handleClose}>
        <Calculator prev={prev} updatePrev={setPrev} submit={handleSubmit} />
      </ReactModal>
      { children }
    </CalculatorContext.Provider>
  );
}