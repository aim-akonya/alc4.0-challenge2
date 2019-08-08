
      const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {https://github.com/aim-akonya/alc4.0-challenge2.git
          code: "US",
          currency: "USD",
          currencyName: '',
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          currencyName: '',
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          currencyName: '',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          currencyName: '',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          currencyName: '',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          currencyName: '',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          currencyName: '',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          currencyName: '',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          currencyName: '',
          country: 'Ghana'
        }
      ];

      const billHype = () => {
        const billDisplay = document.querySelector('.mdc-typography--headline4');
        if (!billDisplay) return;

        billDisplay.addEventListener('click', () => {
          const billSpan = document.querySelector("[data-bill]");
          if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(appState.billFormatted)
            );
          }
        });
      };
	  //my code

	  //appState object
	  const appState = {};

	  //formatAsMoney
	   const formatAsMoney=(amount, buyerCountry)=>{
		   for(let val of countries){
			   if(buyerCountry===val.country){
				   return (amount.toLocaleString('en-'+val.code, {style:'currency', currency: val.currency}));
			   }
		   }
		   return (amount.toLocaleString('en-US', {style:'currency', currency:'USD'}));
	   };

	   //flagIfInvalid
	   const flagIfInvalid=(field, isValid)=>{
		   if(isValid){
			   field.classList.remove('is-invalid');
		   }
		   else{
			   field.classList.add('is-invalid');
		   }
	   }

	   //expiryDateFormatIsValid
	   const expiryDateFormatIsValid = (field)=>{
		   if(field.value.match(/^(\d|(0|1)[1-9])\/\d{2}$/)){
			   return true;
		   }
		   else{
			   return false;
		   }
	   }

	   //detectCardType
	   const detectCardType=(first4Digits)=>{		   
		   const firstDigit = first4Digits.toString().split('')[0];
		   const isVisa = parseInt(firstDigit) === 4;
		   const isMastercard = parseInt(firstDigit) ===5;
		   
		   if(isVisa){
			   document.querySelector('[data-credit-card]').classList.add('is-visa');
			   document.querySelector('[data-card-type]').src=supportedCards.visa;
			   return 'is-visa';
		   }
		   if(isMastercard){
			   document.querySelector('[data-credit-card]').classList.remove('is-visa');
			   document.querySelector('[data-credit-card]').classList.add('is-mastercard');
			   document.querySelector('[data-card-type]').src=supportedCards.mastercard;
			   return 'is-mastercard';
		   }
	   };

	   
	   //validateCardExpiryDate
	   const validateCardExpiryDate=()=>{		   
		   let inputVal = document.querySelector('[data-cc-info]  input:nth-child(2)');
		   const currentDate = new Date();
		   if(expiryDateFormatIsValid(inputVal)){
			   const inputMonth = inputVal.value.split('/')[0];
			   const inputYear = inputVal.value.split('/')[1];
			   const inputDate = `01-${inputMonth}-${inputYear}`;
			   const fullDate = new Date(inputDate);
			   //compare months
			   const checkMonth = (Number(inputMonth) -1) > currentDate.getMonth();
			   //compare year
			   const checkYear =  fullDate.getYear() > currentDate.getYear();
			   if (fullDate.getYear() === currentDate.getYear()){
				   if(checkMonth){
					   flagIfInvalid(inputVal, true);
					   return true;
				   }
				   else{
					   flagIfInvalid(inputVal, false);
					   return false;
				   }
			   }
			   else if(checkYear){
				   flagIfInvalid(inputVal, true);
				   return true;
			   }
			   else{
				   flagIfInvalid(inputVal, false);
				   return false;
			   }
		   }
		   else{
			   flagIfInvalid(inputVal, false);
			   return false;
		   }
	   };



	   //validateCardHolderName
	   const validateCardHolderName=()=>{
		   const fullName = document.querySelector('[data-cc-info] input:nth-child(1)');
		   const name = fullName.value.split(' ');
		   if(name.length == 2){
			   if(name[0].length>=3 && name[1].length>=3){
				   flagIfInvalid(fullName, true);
				   return true;
			   }
			   flagIfInvalid(fullName, false);
			   return false;
		   }
		   else{
			   flagIfInvalid(fullName, false);
			   return false;
		   }
	   };

	   
	   //validateWithLuhn
	   const validateWithLuhn = (digits)=>{
		   if(digits.length != 16){
			   return false;
		   }
		   const double = digits.reverse().map((num, index)=>(index%2==1)? num*2: num);
		  const checkHighValue = double.map(num => (num>9)? num-9: num);
		  const getSum = checkHighValue.reduce((sum, num)=> sum+num, 0);

		  return (getSum%10==0);	  

	   };
	   
	   //validateCardNumber
	   const validateCardNumber =()=>{
		   const digits = appState.cardDigits.flat();
		   const isValid = validateWithLuhn(digits);

		   if(isValid){
			   document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
			   return true;
		   }
		   else{
			   document.querySelector('[data-cc-digits]').classList.add('is-invalid');
			   return false;
		   }

	   };

	   //validatePayment
	   const validatePayment = () => {
		   validateCardNumber();
		   validateCardHolderName();
		   validateCardExpiryDate();
	   };

	   //smartInput
	   const smartInput=(event, fieldIndex, fields)=>{
		   
		   
			   const position = event.target.selectionStart;
			   const field = fields[fieldIndex];
			   const isNumber = isNaN(event.key)===false;
			   const isTab = event.keyCode==9;
			   const isShift = event.keyCode==16;
			   const isDelete = event.keyCode==46;
			   const isBackSpace = event.keyCode==8;
			   const isArrowKey = event.keyCode==37 || event.keyCode==38 || event.keyCode==39 || event.keyCode==40;
			
			if(fieldIndex < 4){
				//allow only valid digits
			   if ( !(isNumber || isTab || isShift ||isDelete || isBackSpace || isArrowKey )){
				   event.preventDefault();
			   }
			   else{
				    
				   if(isNaN(event.key)==false){
					   //pushing to appState.cardDigits
					   if(appState.cardDigits[fieldIndex]){	

						   if(appState.cardDigits[fieldIndex][position]){
							   appState.cardDigits[fieldIndex].splice(position, 1, event.key)
						   }
						   else{
							   appState.cardDigits[fieldIndex][position]=(event.key);
						   }						   
					   }
					   else{						   
						   appState.cardDigits[fieldIndex]=[event.key];
					   }

					   if(field.value.length==0){
						   field.value=event.key;
						   event.preventDefault();
					   }
					   else{
						   field.value += event.key;
						   event.preventDefault();
					   }
					   //masking
					   if(fieldIndex<3){
					   window.setTimeout(()=>{
						   let arr = field.value.split('');
						   arr.splice(position, 1, '#');
						   field.value=	arr.join('');
					   }, 500);
					   }
				   }
			   }			   		   
		   }
		   
		   //validating the name input field
		   if(fieldIndex === 4){
			   const isValid = event.key.match(/^[a-zA-Z\s]*$/);
			   if(!(isValid || isTab || isShift ||isBackSpace ||isDelete ||isArrowKey)){
				   event.preventDefault();
			   }			   
		   }

		   //validating the date input field
		   if(fieldIndex === 5){
			   const isValid = event.key.match(/^[0-9\/]*$/);
			   if(!(isValid || isTab ||isShift || isBackSpace || isDelete || isArrowKey)){
				   event.preventDefault();
			   }
		   }

		   if(isNumber){
			   smartCursor(event, fieldIndex, fields);
		   }

		   if(fieldIndex===0){
			   if(isNumber){
				   const first4Digits = appState.cardDigits[0].join('');
				   detectCardType(first4Digits);
			   }
		   }

	   };

	   //acceptCardNumbers
	   const acceptCardNumbers=(event, fieldIndex)=>{};

	   //smartCursor
	   const smartCursor = (event, fieldIndex, fields)=>{
		   const fieldSize = fields[fieldIndex].size;
		   for(let i=1; i<=fieldSize; i++){
			   let size = fields[fieldIndex].value.length;
			   if(size===fieldSize){
				   if(fieldIndex != 5){
					   fields[fieldIndex+1].focus();
				   }
			   }
		   }
	   };

	   //enableSmartTyping
	   const enableSmartTyping=()=>{
		   const firstInput = document.querySelector('[data-cc-digits] input:nth-child(1)');
		   const secondInput = document.querySelector('[data-cc-digits] input:nth-child(2)');
		   const thirdInput = document.querySelector('[data-cc-digits] input:nth-child(3)');
		   const fourthInput = document.querySelector('[data-cc-digits] input:nth-child(4)');

		   const nameField = document.querySelector('[data-cc-info] input:nth-child(1)');
		   const dateField = document.querySelector('[data-cc-info] input:nth-child(2)');

		  const inputFields = [firstInput, secondInput, thirdInput, fourthInput, nameField, dateField];

		  inputFields.forEach((field, index, fields)=>{
			  
			  field.addEventListener('keydown', (event)=>{
				  smartInput(event, index, fields)
			  });
		  });
		  
	   };


	   //uiCanInteract
	   const uiCanInteract=()=>{
		   document.querySelector('[data-cc-digits] input:nth-child(1)').focus();
		   document.querySelector('[data-pay-btn]').addEventListener('click',validatePayment);
		   billHype();
		   enableSmartTyping();
	   };

	   //displayCartTotal
	   const displayCartTotal=({results})=>{
		   const [data] = results;
		   const {itemsInCart, buyerCountry} = data;
		   appState.items = itemsInCart;
		   appState.country = buyerCountry;
		   appState.bill = itemsInCart.reduce((tot, {price, qty})=> tot+(price * qty), 0);
		   appState.billFormatted = formatAsMoney(appState.bill, appState.country);
		   document.querySelector('[data-bill]').textContent = appState.billFormatted;
		   appState.cardDigits = [];
		   uiCanInteract();
	   };	  
	  
	  
      //fetchBill
	  const fetchBill = () => {
        const apiHost = 'https://randomapi.com/api';
		const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
		const apiEndpoint = `${apiHost}/${apiKey}`;
		fetch(apiEndpoint)
			.then(response => response.json())
			.then(data => displayCartTotal(data))
			.catch(error => console.log(error));        
      };
      
      const startApp = () => {
		  fetchBill();
      };

      startApp();
