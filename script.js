
    const cities = {
      "Anchorage, AK": 9500,
      "Atlanta, GA": 3000,
      "Boston, MA": 5000,
      "Calgary, AB": 7500,
      "Chicago, IL": 5500,
      "Cleveland, OH": 4300,
      "Dallas, TX": 1800,
      "Denver, CO": 6000,
      "Detroit, MI": 4800,
      "Edmonton, AB": 8100,
      "Halifax, NS": 4600,
      "Houston, TX": 1300,
      "Kansas City, MO": 4300,
      "Los Angeles, CA": 1000,
      "Miami, FL": 500,
      "Minneapolis, MN": 7000,
      "Montreal, QC": 5000,
      "Nashville, TN": 2800,
      "New York, NY": 4100,
      "Ottawa, ON": 4800,
      "Philadelphia, PA": 4400,
      "Phoenix, AZ": 800,
      "Portland, OR": 4500,
      "Quebec City, QC": 5900,
      "Regina, SK": 7800,
      "San Francisco, CA": 1500,
      "Seattle, WA": 4200,
      "St. Louis, MO": 4000,
      "Sudbury, ON": 6000,
      "Toronto, ON": 4200,
      "Vancouver, BC": 3000,
      "Washington, DC": 3900,
      "Winnipeg, MB": 7200,
      "Windsor, ON": 3600,
      "Yellowknife, NT": 9500
    };

    const fuels = [
      { name: "Electricity (¢/kWh)", btu: 3412 },
      { name: "Natural Gas (¢/m³)", btu: 35870 },
      { name: "Natural Gas ($/therm)", btu: 100000 },
      { name: "Propane ($/L)", btu: 91600 },
      { name: "Propane ($/gallon)", btu: 91600 },
      { name: "Heating Oil ($/L)", btu: 138500 },
      { name: "Firewood (Full Cord)", btu: 20000000 },
      { name: "Firewood (Face Cord 16")", btu: 6666670 },
      { name: "Firewood (Face Cord 24")", btu: 10000000 },
      { name: "Wood Pellets ($/ton)", btu: 16000000 },
      { name: "Bituminous Coal ($/ton)", btu: 24000000 },
      { name: "Anthracite Coal ($/ton)", btu: 25000000 },
      { name: "Corn ($/bushel)", btu: 392000 },
      { name: "Corn ($/ton)", btu: 16000000 }
    ];

    const appliances = {
      "Mini-Split Heat Pump": 300,
      "High-Efficiency Gas Furnace": 95,
      "Mid-Efficiency Gas Furnace": 80,
      "High-Efficiency Propane Furnace": 92,
      "Wood Stove (certified)": 70,
      "Pellet Stove": 75,
      "Baseboard Electric": 100,
      "Older Furnace": 60,
      "Hand-Fired Coal Stove": 70,
      "Stoker Coal Stove": 80,
      "Corn Stove": 75,
      "Multi-Fuel Pellet Stove": 70
    };

    function populateCities() {
      const cityDropdown = document.getElementById("city");
      Object.entries(cities).forEach(([city, hdd]) => {
        const option = document.createElement("option");
        option.value = hdd;
        option.textContent = city;
        cityDropdown.appendChild(option);
      });
      cityDropdown.value = "4200"; // Default to Toronto
    }

    function createTable() {
      const tbody = document.getElementById("fuel-rows");
      tbody.innerHTML = "";

      fuels.forEach((fuel, index) => {
        const row = document.createElement("tr");

        const applianceOptions = Object.entries(appliances).map(
          ([name, eff]) => `<option value="${eff}">${name}</option>`
        ).join('');

        row.innerHTML = `
          <td>${fuel.name}</td>
          <td><input type="number" id="price-${index}" step="any" /></td>
          <td>
            <select id="appliance-${index}">
              ${applianceOptions}
            </select>
          </td>
          <td id="efficiency-${index}">--</td>
          <td id="cost100k-${index}">--</td>
          <td id="seasonal-${index}">--</td>
        `;

        tbody.appendChild(row);
      });
    }

    function updateCalculations() {
      const cityHDD = parseFloat(document.getElementById("city").value);
      const sqft = parseFloat(document.getElementById("sqft").value);
      const seasonalBTUs = cityHDD * sqft * 20;

      fuels.forEach((fuel, index) => {
        const priceInput = document.getElementById(`price-${index}`);
        const applianceSelect = document.getElementById(`appliance-${index}`);
        const price = parseFloat(priceInput.value);
        const efficiency = parseFloat(applianceSelect.value) / 100;

        const efficiencyCell = document.getElementById(`efficiency-${index}`);
        const cost100kCell = document.getElementById(`cost100k-${index}`);
        const seasonalCell = document.getElementById(`seasonal-${index}`);

        if (!isNaN(price) && efficiency > 0) {
          const costPerBTU = price / fuel.btu / efficiency;
          const costPer100k = costPerBTU * 100000;
          const seasonalCost = costPerBTU * seasonalBTUs;

          efficiencyCell.textContent = (efficiency * 100).toFixed(0) + "%";
          cost100kCell.textContent = "$" + costPer100k.toFixed(2);
          seasonalCell.textContent = "$" + seasonalCost.toFixed(0);
        } else {
          efficiencyCell.textContent = "--";
          cost100kCell.textContent = "--";
          seasonalCell.textContent = "--";
        }
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      populateCities();
      createTable();
      updateCalculations();
      document.querySelectorAll("input, select").forEach(el =>
        el.addEventListener("input", updateCalculations)
      );
    });
  