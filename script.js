$(document).ready(function () {
	// function for preload hiding
	$(window).on('load', function () {
		$('main').delay(2500).fadeIn(800);
		$('.preload').delay(2500).fadeOut(500);
	});


	// function for fetching data from urls
	function getAjaxData(url) {
		$.ajax({
			type: "GET",
			url: url,
			success: function (data) {
				array = data;
			},
			async: false,
		});
		return array;
	}


	// fetching data from urls usign function 'getAjaxData'
	let avatarArr = [];
	let userArr = getAjaxData("https://my-json-server.typicode.com/ka245/fake-json/users");
	let addressArr = getAjaxData("https://my-json-server.typicode.com/ka245/fake-json/address");
	let statusArr = getAjaxData("https://my-json-server.typicode.com/ka245/fake-json/status");
	getAjaxData("https://tinyfac.es/api/users").forEach((avatar) =>
		avatar.avatars.forEach((item) => {
			if (avatarArr.length < userArr.length) {
				if (item.size == 'medium') {
					avatarArr.push({
						url: item.url
					});
				}
			}
		})
	);


	// storing all data in one array
	let res = userArr.reduce((array, user, index) => {
		array.push({
			...user,
			...addressArr.find((address) => address.userId === user.id || address.iuserId === user.id),
			...statusArr.find((status) => status.userId === user.id),
			...avatarArr[index],
		});
		return array;
	}, []);


	// rendering array items in html
	$.each(res, function (index, user) {
		let address;
		address = Object.values(user.address).slice(0, 3).join(', ');
		let contact = `<div class="contacts__contact">
		<div class="contact__id">${user.id}</div>
		<div class="contact__photo"><img src="${user.url}" alt="avatar"></div>
		<div class="contact__name">${user.name}</div>
		<div class="contact__phone">${user.phone}</div>
		<div class="contact__email">${user.email}</div>
		<div class="contact__address">${address}</div>
		<div class="contact__status">${user.status}</div>
	</div>`
		return $('.contacts__cards').append(contact);
	});


	// Searching users by name
	$('.contacts__search').on("keyup", function () {
		let value = $(this).val().toLowerCase();
		$('div.contact__name').filter(function () {
			$(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	});


	// Searching users by email
	$('.contacts__search').on("keyup", function () {
		let value = $(this).val().toLowerCase();
		$('div.contact__email').filter(function () {
			$(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});

	// Toggling status dropdown
	$('.contacts__column-title.contact__status').click(function () {
		$('.dropdown').slideToggle(500);
	});
	$('.contacts__filter a').click(function () {
		$('.dropdown').slideToggle(500);
	});


	// Filtering contacts by status
	$('.dropdown').click(function (event) {
		let status = $(event.target).text();
		if (status == 'all') {
			clearFilter();
		} else {
			$('.contacts__cards > div').fadeIn();
			$('.contact__status').each(function () {
				if ($(this).text() != status) {
					$(this).parent('div.contacts__contact').hide();
				}
			});
		}

		function clearFilter() {
			$('.contacts__cards > div').fadeIn();
		}
	});

});