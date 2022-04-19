let purchasedItem;
window.logged = {
	in:true,
}
const stripeHandler = StripeCheckout.configure({
	key:window.stripePublicKey,
	locale:"auto",
	token:function(token){
		if(purchasedItem!=null){
			fetch("/purchase",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({
					stripeTokenId:token.id,
					items:[{id:purchasedItem}]
				})
			}).then( res => {
				if(res.ok) {
					return res.json()
				}else{
					return res.json().then(json => Promise.reject(json))
				}
			}).then( data => {
				console.log(data)
				document.getElementById("user-current-hype").innerHTML = data.total+" HC";
				document.getElementById("user-hype-message").style.display = "block";
				document.getElementById("user-hype-message").innerHTML = data.message
			}).catch(e => {
				document.getElementById("user-hype-message").style.display = "block";
				document.getElementById("user-hype-message").innerHTML = e.message
				//console.error(e.message)
			})
		}
	}
})


class DenyButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user; 
		this.btn.addEventListener("click", function(){
			// $.get("/denyfriend?user="+escape(self.user), function(OBJ) {
			// 	self.btn.parentElement.parentElement.remove();
			// });
			document.getElementById("request-error").style.display="none";
					
			fetch("/denyfriend",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({
					user:self.user
				})
			}).then( res => {
				if(res.ok) {
					return res.json()
				}else{
					return res.json().then(json => Promise.reject(json))
				}
			}).then( data => {
				document.getElementById("request-error").style.display="block";
				if(data.error != null){
					document.getElementById("request-error").innerHTML = data.error;
				}else{
					document.getElementById("request-error").innerHTML = "friendship denied";
				}
				self.btn.parentElement.parentElement.remove();
			}).catch(e => {
				document.getElementById("request-error").style.display="block";
				document.getElementById("request-error").innerHTML = "there was an error :/";
			})
		})
	}
}

class AcceptButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user;
		this.btn.addEventListener("click", function(){
			// $.get("/acceptfriend?user="+escape(self.user), function(OBJ) {
			// 	self.btn.parentElement.parentElement.remove();
			// });
			document.getElementById("request-error").style.display="none";
			fetch("/acceptfriend",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({
					user:self.user
				})
			}).then( res => {
				if(res.ok) {
					return res.json()
				}else{
					return res.json().then(json => Promise.reject(json))
				}
			}).then( data => {
				document.getElementById("request-error").style.display="block";
				if(data.error != null){
					document.getElementById("request-error").innerHTML = data.error;
				}else{
					document.getElementById("request-error").innerHTML = "friendship confirmed";
				}
				self.btn.parentElement.parentElement.remove();
			}).catch(e => {
				document.getElementById("request-error").style.display="block";
				document.getElementById("request-error").innerHTML = "there was an error :/";
			})

		})
	}
}

class RemoveButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user;
		this.btn.addEventListener("click", function(){
			// $.get("/removefriend?user="+escape(self.user), function(OBJ) {
			// 	self.btn.parentElement.parentElement.remove(); // two parents abovve
			// });
			
			document.getElementById("add-friend-error").style.display="none";
			fetch("/removefriend",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({
					user:self.user
				})
			}).then( res => {
				if(res.ok) {
					return res.json()
				}else{
					return res.json().then(json => Promise.reject(json))
				}
			}).then( data => {
				document.getElementById("add-friend-error").style.display = "block";
				if(data.error != null){
					document.getElementById("add-friend-error").innerHTML = data.error;
				}else{
					document.getElementById("add-friend-error").style.display = "removed friend";
				}
				self.btn.parentElement.parentElement.remove(); 
			}).catch(e => {
				addFriendError("there was an error :/");
			})	
		})
	}
}


class BuyButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.item = OBJ.item;
		this.btn.addEventListener("click", function(){
			

		})
	}
}

class HypeButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.item = parseInt(OBJ.item);
		this.price = parseInt(OBJ.price);
		this.btn.addEventListener("click", function(){
			purchasedItem = self.item;
			stripeHandler.open({
				amount:self.price
			});
		});
	}
}


document.getElementById("user-button").addEventListener("click",function(){
	hideAll();
	document.getElementById('user-holder-user').style.display = "block";
	document.getElementById('user-button').className = "user-header-buttons-active";
})
document.getElementById("user-items").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-items").style.display = "block";
	document.getElementById('user-items').className = "user-header-buttons-active";
})
document.getElementById("user-friends").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-friends").style.display = "block";
	document.getElementById('user-friends').className = "user-header-buttons-active";
})
document.getElementById("user-requests").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-requests").style.display = "block";
	document.getElementById('user-requests').className = "user-header-buttons-active";
})

document.getElementById("user-bux").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-bux").style.display = "block";
	document.getElementById('user-bux').className = "user-header-buttons-active";
})


const denyBtns = document.getElementsByClassName("friend-requests-deny");
const denyArray = [];
for(let i = 0;i<denyBtns.length; i++){
	denyArray.push(new DenyButton({btn:denyBtns[i],user:denyBtns[i].dataset.user}))
}

const acceptBtns = document.getElementsByClassName("friend-requests-accept");
const acceptArray = [];
for(let i = 0;i<acceptBtns.length; i++){
	acceptArray.push(new AcceptButton({btn:acceptBtns[i],user:acceptBtns[i].dataset.user}))
}

const removeBtns = document.getElementsByClassName("friend-remove");
const removeArray = [];
for(let i = 0;i<removeBtns.length; i++){
	removeArray.push(new RemoveButton({btn:removeBtns[i],user:removeBtns[i].dataset.user}))
}

const buyBtns = document.getElementsByClassName("items-individual-holder");
const buyArray = [];
for(let i = 0;i<buyBtns.length; i++){
	if(buyBtns[i].dataset.item != null){
		buyArray.push(new BuyButton({btn:buyBtns[i],item:buyBtns[i].dataset.item}))
	}else{
		buyBtns[i].style.cursor = "default";
	}
}

const hypeBtns = document.getElementsByClassName("bux-buy");
const hypeArray = [];
for(let i = 0;i<hypeBtns.length; i++){
	//if(hypeBtns[i].dataset.item != null){
	hypeArray.push(new HypeButton({btn:hypeBtns[i],item:hypeBtns[i].dataset.item, price:hypeBtns[i].dataset.price}))
	//}
}

document.getElementById("add-friend-btn").addEventListener("click",function(){
	const user = document.getElementById("add-friend-user-name").value;
	console.log(user);
	document.getElementById('add-friend-success').style.display = "none";
	if(user.length >= 8 && user.length <= 15){
		document.getElementById('add-friend-error').style.display = "none";
		// $.get("/addfriend?user="+escape(user), function(OBJ) {
		// 	console.log(OBJ)
		// 	if(OBJ.error!=null){
		// 		addFriendError(OBJ.error);
		// 	}else{
		// 		document.getElementById('add-friend-success').style.display = "block";
		// 	}
		// });
		fetch("/addfriend",{
			method:"POST",
			headers:{
				"Content-Type":"application/json",
				"Accept":"application/json"
			},
			body:JSON.stringify({
				user:user
			})
		}).then( res => {
			if(res.ok) {
				return res.json()
			}else{
				return res.json().then(json => Promise.reject(json))
			}
		}).then( data => {
			console.log(data)
			
			if(data.error!=null){
				addFriendError(data.error);
			}else{
				document.getElementById('add-friend-success').style.display = "block";
			}
		}).catch(e => {
			addFriendError("there was an error")
			//console.error(e.message)
		})
	}else{
		addFriendError("wrong amount of characters");
	}
})


function addFriendError(err){
	document.getElementById('add-friend-error').style.display = "block";
	document.getElementById('add-friend-error').innerHTML = err;
}



function hideAll(){
	const one = document.getElementsByClassName("user-header-buttons-active");
	for(let k = 0;k<one.length; k++){
		one[k].className = "user-header-buttons";
	}
	const collection = document.getElementsByClassName("user-section-holders");
	for(let i = 0;i<collection.length; i++){
		collection[i].style.display="none";
	}
}
