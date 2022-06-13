"use strict";
const country_pages = [];
const cities = {};
let countries_page_number = 0, cities_page_number = 0;
let selected_country;

const display_country_page = async page_number => {
	if (page_number >= 0) {
		if (!country_pages[page_number]) await fetch(`https://api.openaq.org/v2/countries?limit=20&page=${page_number + 1}`).then(response => response.json()).then(data => {
			if (!page_number || data.results.length) country_pages[page_number] = data.results;
		}).catch(error => console.error(error));
		if (country_pages[page_number]) {
			let country_list_elements = "";
			country_pages[page_number].forEach(country => country_list_elements += `<li onclick="display_city_page(0, '${country.code}')">${country.name}</li>`);
			document.getElementById("country_list").innerHTML = country_list_elements;
			document.getElementById("countries_page_label").innerText = "Page " + (page_number + 1);
			countries_page_number = page_number;
		}
	}
};

const display_city_page = async (page_number, country_code = selected_country) => {
	if (page_number >= 0) {
		if (!(country_code in cities)) cities[country_code] = [];
		if (!cities[country_code][page_number]) await fetch(`https://api.openaq.org/v2/cities?limit=20&page=${page_number + 1}&country_id=${country_code}`).then(response => response.json()).then(data => {
			if (!page_number || data.results.length) cities[country_code][page_number] = data.results;
		}).catch(error => console.error(error));
		if (cities[country_code][page_number]) {
			let city_list_elements = "";
			cities[country_code][page_number].forEach(city => city_list_elements += `<li onclick="display_measurements('${city.city}')">${city.city}</li>`);
			document.getElementById("city_list").innerHTML = city_list_elements;
			document.getElementById("cities_page_label").innerText = "Page " + (page_number + 1);
			selected_country = country_code;
			cities_page_number = page_number;
		}
	}
};

const display_measurements = city => {
	fetch(`https://api.openaq.org/v2/locations?city=${city}`).then(response => response.json()).then(data => {
		const averages = {};
		const counters = {};
		data.results.forEach(location => {
			location.parameters.forEach(parameter => {
				if (parameter.parameterId in averages) {
					averages[parameter.parameterId] += parameter.lastValue;
					counters[parameter.parameterId]++;
				} else {
					averages[parameter.parameterId] = parameter.lastValue;
					counters[parameter.parameterId] = 1;
				}
			});
		});
		document.querySelectorAll("#measurements li").forEach(element => element.style.display = "none");
		Object.keys(averages).forEach(key => {
			const measurements_element = document.getElementById(key);
			measurements_element.innerText = averages[key] / counters[key];
			measurements_element.parentElement.style.display = "list-item";
		});
	});
};

display_country_page(0);