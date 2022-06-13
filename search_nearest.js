const find_nearest_city = () => {
	fetch(`https://api.openaq.org/v2/locations?limit=100000&coordinates=${document.getElementById("latitude").value}%2C${document.getElementById("longitude").value}&radius=100000`).then(response => response.json()).then(data => {
		if (!data.results.length) {
			document.getElementById("location_name").innerText = "There is no location within 100,000km that has valid data. Try different coordinates!";
			document.querySelectorAll("#measurements li").forEach(element => element.style.display = "none");
			return;
		}
		const user_latitude = document.getElementById("latitude").value;
		const user_longitude = document.getElementById("longitude").value;
		let nearest_location_index;
		let shortest_distance = Infinity;
		data.results.forEach((location, index) => {
			if ("coordinates" in location) {
				const distance = Math.sqrt((location.coordinates.latitude - user_latitude) ** 2 + (location.coordinates.longitude - user_longitude) ** 2);
				if (distance < shortest_distance) {
					nearest_location_index = index;
					shortest_distance = distance;
				}
			}
		});
		document.querySelectorAll("#measurements li").forEach(element => element.style.display = "none");
		data.results[nearest_location_index].parameters.forEach(parameter => {
			const measurements_element = document.getElementById(parameter.parameterId);
			measurements_element.innerText = parameter.lastValue;
			measurements_element.parentElement.style.display = "list-item";
			document.getElementById("location_name").innerText = `${data.results[nearest_location_index].name}, ${data.results[nearest_location_index].city}, ${data.results[nearest_location_index].country}`;
		});
	});
};