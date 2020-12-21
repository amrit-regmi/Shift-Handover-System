const baseStyle = `/* Base ------------------------------ */
		*:not(br):not(tr):not(html) {
			font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
		}

		body {
			width: 100% !important;
			height: 100%;
			margin: 0;
			line-height: 1.4;
			background-color: #F5F7F9;
			color: #839197;
			-webkit-text-size-adjust: none;
		}

		a {
			color: #414EF9;
		}

		/* Layout ------------------------------ */
		.email-wrapper {
			width: 100%;
			margin: 0;
			padding: 0;
			background-color: #F5F7F9;
		}

		.email-content {
			width: 100%;
			margin: 0;
			padding: 0;
		}

		/* Masthead ----------------------- */
		.email-masthead {
			padding: 25px 0;
			text-align: center;
		}

		.email-masthead_logo {
			max-width: 400px;
			border: 0;
		}

		.email-masthead_name {
			font-size: 16px;
			font-weight: bold;
			color: #839197;
			text-decoration: none;
			text-shadow: 0 1px 0 white;
		}

		/* Body ------------------------------ */
		.email-body {
			width: 100%;
			margin: 0;
			padding: 0;
			border-top: 1px solid #E7EAEC;
			border-bottom: 1px solid #E7EAEC;
			background-color: #FFFFFF;
		}

		.email-body_inner {
			width: 615px;
			margin: 0 auto;
			padding: 0;
		}

		.email-footer {
			width: 615px;
			margin: 0 auto;
			padding: 0;
			text-align: center;
		}

		.email-footer p {
			color: #839197;
		}

		.body-action {
			width: 100%;
			margin: 30px auto;
			padding: 0;
			text-align: center;
		}

		.body-sub {
			margin-top: 25px;
			padding-top: 25px;
			border-top: 1px solid #E7EAEC;
		}

		.content-cell {
			padding: 35px;
		}

		.align-right {
			text-align: right;
		}

		/* Type ------------------------------ */
		h1 {
			margin-top: 0;
			color: #292E31;
			font-size: 19px;
			font-weight: bold;
			text-align: left;
		}

		h2 {
			margin-top: 0;
			color: #292E31;
			font-size: 16px;
			font-weight: bold;
			text-align: left;
		}

		h3 {
			margin-top: 0;
			color: #292E31;
			font-size: 14px;
			font-weight: bold;
			text-align: left;
		}

		p {
			margin-top: 0;
			color: #839197;
			font-size: 16px;
			line-height: 1.5em;
			text-align: left;
		}

		p.sub {
			font-size: 12px;
		}

		p.center {
			text-align: center;
		}
		

		/*Media Queries ------------------------------ */
		@media only screen and (max-width: 600px) {

			.email-body_inner,
			.email-footer {
				width: 100% !important;
			}
		}

`


const buttonStyle= `/* Buttons ------------------------------ */
		.button {
			display: inline-block;
			width: 200px;
			background-color: #414EF9;
			border-radius: 3px;
			color: #ffffff;
			font-size: 15px;
			line-height: 45px;
			text-align: center;
			text-decoration: none;
			-webkit-text-size-adjust: none;
			mso-hide: all;
    }
    .linkColorWhite{
      color:white !important;
    }

		.button--green {
			background-color: #28DB67;
		}

		.button--red {
			background-color: #FF3665;
		}

		.button--blue {
			background-color: #414EF9;
    }		

    @media only screen and (max-width: 500px) {
			.button {
				width: 100% !important;
			}
		}`

const shiftReportStyle = `
    .title {
			margin-bottom:20px;
		}
		.station{
			border-radius:.25rem; 
			color:#fff; background-color:#343a40; 
			padding:0.25em 0.25em; 
			font-size:0.8rem;
		}
		
		tr .header{
			width:25%; 
			padding:5px; 
			color:#004085; 
			background-color:#cce5ff; 
			border-color:#b8daff;
		}
		
		.taskBox{
			border:1px solid #b8daff; 
			height:auto; 
			border-bottom:2px solid #b8daff
		}
		
		.taskBoxInner {
			width:96%; 
			display:inline-flex;
			border-top:0.5px outset #b8daff;
			padding:5px; 
			text-align:justify;
		}
		.taskNumber{
			border-right:2.5px solid #1c181f14; 
			padding:5px 5px 0px; 
			display:inline-flex; 
			text-align:center; 
			width:fit-content;
			margin-right:10px;  
			font-weight:bold;
			}
		.taskContent{
			text-align:'justify'
		}
		
		.taskLabel{
			width: fit-content;
			display:inline;
		  padding: 0 5px 0;
			text-align: center;
			font-size: 10px;
			color: #fff;
			background: grey;
			height: fit-content;
			width: auto;
			margin-right: 5px;
			border-radius: 5px;
		
		}
		
		.taskLabel.deferred{
			background: #ff4500;
		}
		.taskLabel.open{
			background: #008080;
		}
		.taskLabel.closed{
			background: #228b22;
		}
		.taskLabel.actionRequired{
			background: red;
		}
		
		
		.tableCell {
      width:25%;
      padding:5px;
      border:1px solid #b8daff;
		}
		
		.empty{
			display:block; 
			height:5px;
		}
    `
const getBasicStyle = () => {
  return (
    `	<style type="text/css" rel="stylesheet" media="all">
    ${baseStyle}
    ${buttonStyle}

	</style>`
  )
}

const getShiftReportStyle = () => {
  return (
    `	<style type="text/css" rel="stylesheet" media="all">
    ${baseStyle}
    ${shiftReportStyle}

	</style>`
  )
}

module.exports = { getBasicStyle, getShiftReportStyle }