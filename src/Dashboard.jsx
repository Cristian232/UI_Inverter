import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Dashboard() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const parsedData = JSON.parse(data.data.replace(/&quot;/g, '"'));
            setWeatherData(parsedData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Failed to fetch data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
        const intervalId = setInterval(() => fetchWeatherData(), 60000);
        const countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 60));
        }, 1000);

        return () => {
            clearInterval(intervalId);
            clearInterval(countdownInterval);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Chart.js data and options
    const chartData = {
        labels: weatherData.powerCurve.xAxis,
        datasets: [
            {
                label: 'Active Power (kW)',
                data: weatherData.powerCurve.activePower.map(power => (power !== '-' ? Number(power) : 0)),
                borderColor: '#ff9900',
                backgroundColor: 'rgba(255, 153, 0, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#fff',
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#ccc',
                },
            },
            y: {
                ticks: {
                    color: '#ccc',
                },
            },
        },
    };

    const CircularCountdown = () => {
        const strokeDasharray = 283; // Circumference of the circle
        const circleProgress = (countdown / 60) * strokeDasharray;

        return (
            <div className="countdown-container">
                <svg className="countdown-circle" width="100" height="100">
                    <circle cx="50" cy="50" r="45" className="circle-background" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="circle-progress"
                        style={{ strokeDasharray: `${circleProgress} ${strokeDasharray}` }}
                    />
                </svg>
                <div className="countdown-text">{countdown}s</div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* KPI Cards */}
            <div className="kpi-cards">
                <div className="kpi-card">
                    <h2>{weatherData.realKpi.realTimePower} kW</h2>
                    <p>Real-Time Power</p>
                </div>
                <div className="kpi-card">
                    <h2>{weatherData.realKpi.dailyEnergy.toFixed(2)} MWh</h2>
                    <p>Yield Today</p>
                </div>
                <div className="kpi-card">
                    <h2>{weatherData.realKpi.monthEnergy.toFixed(2)} MWh</h2>
                    <p>Yield This Month</p>
                </div>
                <div className="kpi-card">
                    <h2>{weatherData.realKpi.yearEnergy.toFixed(2)} MWh</h2>
                    <p>Yield This Year</p>
                </div>
                <div className="kpi-card">
                    <h2>{weatherData.realKpi.cumulativeEnergy.toFixed(2)} MWh</h2>
                    <p>Total Yield</p>
                </div>

                <div className="kpi-card">
                    {/* Countdown Timer */}
                    <CircularCountdown/>
                    <p>Countdown Timer</p>
                </div>

            </div>

            {/* Power Chart */}
            <div className="power-chart">
                <h3>Power Chart</h3>
                <Line data={chartData} options={chartOptions}/>
            </div>

            {/* Environmental Benefits */}
            <div className="environment-benefits">
                <h3>Environmental Benefits</h3>
                <div className="benefits-details">
                    <p><strong>CO2 Avoided:</strong> {weatherData.socialContribution.co2ReductionByYear.toFixed(2)} tons</p>
                    <p><strong>Standard Coal Saved:</strong> {weatherData.socialContribution.standardCoalSavings.toFixed(2)} tons</p>
                    <p><strong>Equivalent Trees Planted:</strong> {weatherData.socialContribution.equivalentTreePlanting}</p>
                </div>
            </div>


        </div>
    );
}

export default Dashboard;
