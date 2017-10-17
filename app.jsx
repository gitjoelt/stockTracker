import React from 'react';
import ReactDOM from 'react-dom';
import AddTickerForm from './src/components/AddTickerForm.jsx';

import './css/pure.css';
import './css/pure-responsive.css';
import './css/style.css';


function Application() {
	return (
		<div>
			<AddTickerForm />	
		</div>
	);
}

ReactDOM.render(<Application />, document.getElementById('App'));