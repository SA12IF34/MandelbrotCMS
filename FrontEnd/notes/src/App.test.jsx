import {render, screen} from '@testing-library/react';
import App from './App';
import { expect } from '@jest/globals';

describe('tests the app component', () => {
    it('should test the app component', () => {
        render(<App />);

        let container = screen.getByTestId('app-c')

        expect(container).toBeInTheDocument()
        
        
    })
})


