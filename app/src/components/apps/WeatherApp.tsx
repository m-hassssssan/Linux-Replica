import { useState } from 'react';
import * as Icons from 'lucide-react';

const WEATHER_DATA: Record<string, any> = {
  london: { temp: 14, condition: 'Cloudy', humidity: 72, wind: 18, feels: 12, forecast: [{ day: 'Mon', high: 15, low: 9, icon: 'cloud' }, { day: 'Tue', high: 17, low: 11, icon: 'sun' }, { day: 'Wed', high: 13, low: 8, icon: 'rain' }, { day: 'Thu', high: 16, low: 10, icon: 'cloud-sun' }, { day: 'Fri', high: 18, low: 12, icon: 'sun' }] },
  tokyo: { temp: 22, condition: 'Clear', humidity: 55, wind: 10, feels: 24, forecast: [{ day: 'Mon', high: 23, low: 17, icon: 'sun' }, { day: 'Tue', high: 25, low: 19, icon: 'sun' }, { day: 'Wed', high: 21, low: 16, icon: 'cloud' }, { day: 'Thu', high: 20, low: 15, icon: 'rain' }, { day: 'Fri', high: 22, low: 17, icon: 'cloud-sun' }] },
  'new york': { temp: 18, condition: 'Partly Cloudy', humidity: 60, wind: 22, feels: 16, forecast: [{ day: 'Mon', high: 19, low: 12, icon: 'cloud-sun' }, { day: 'Tue', high: 21, low: 14, icon: 'sun' }, { day: 'Wed', high: 17, low: 10, icon: 'cloud' }, { day: 'Thu', high: 15, low: 9, icon: 'rain' }, { day: 'Fri', high: 20, low: 13, icon: 'sun' }] },
  paris: { temp: 16, condition: 'Rainy', humidity: 80, wind: 14, feels: 14, forecast: [{ day: 'Mon', high: 17, low: 11, icon: 'rain' }, { day: 'Tue', high: 18, low: 12, icon: 'cloud' }, { day: 'Wed', high: 20, low: 13, icon: 'sun' }, { day: 'Thu', high: 19, low: 12, icon: 'cloud-sun' }, { day: 'Fri', high: 16, low: 10, icon: 'rain' }] },
  sydney: { temp: 26, condition: 'Sunny', humidity: 45, wind: 20, feels: 28, forecast: [{ day: 'Mon', high: 27, low: 20, icon: 'sun' }, { day: 'Tue', high: 28, low: 21, icon: 'sun' }, { day: 'Wed', high: 25, low: 19, icon: 'cloud-sun' }, { day: 'Thu', high: 24, low: 18, icon: 'cloud' }, { day: 'Fri', high: 26, low: 20, icon: 'sun' }] },
};

const WeatherIcon = ({ type, className = 'w-6 h-6' }: { type: string; className?: string }) => {
  switch (type) {
    case 'sun': return <Icons.Sun className={`${className} text-yellow-400`} />;
    case 'cloud': return <Icons.Cloud className={`${className} text-gray-400`} />;
    case 'rain': return <Icons.CloudRain className={`${className} text-blue-400`} />;
    case 'cloud-sun': return <Icons.CloudSun className={`${className} text-yellow-300`} />;
    default: return <Icons.Sun className={`${className} text-yellow-400`} />;
  }
};

export default function WeatherApp() {
  const [city, setCity] = useState('London');
  const [data, setData] = useState(WEATHER_DATA['london']);

  const search = () => {
    setTimeout(() => {
      const key = city.toLowerCase();
      setData(WEATHER_DATA[key] || {
        temp: Math.floor(10 + Math.random() * 20),
        condition: 'Clear',
        humidity: Math.floor(40 + Math.random() * 40),
        wind: Math.floor(5 + Math.random() * 25),
        feels: Math.floor(10 + Math.random() * 20),
        forecast: Array.from({ length: 5 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
          high: Math.floor(18 + Math.random() * 10),
          low: Math.floor(8 + Math.random() * 8),
          icon: ['sun', 'cloud', 'rain', 'cloud-sun', 'sun'][Math.floor(Math.random() * 5)],
        })),
      });
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search city..."
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white
            placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
        />
        <button onClick={search} className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff]">
          <Icons.Search className="w-4 h-4" />
        </button>
      </div>

      {/* Current */}
      <div className="text-center mb-4">
        <h2 className="text-lg text-white font-semibold capitalize">{city}</h2>
        <div className="flex items-center justify-center gap-3 my-3">
          <WeatherIcon type={data.forecast[0].icon} className="w-16 h-16" />
          <div>
            <div className="text-4xl text-white font-light">{data.temp}°</div>
            <div className="text-xs text-white/50">{data.condition}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: 'Feels', value: `${data.feels}°`, icon: Icons.Thermometer },
            { label: 'Humidity', value: `${data.humidity}%`, icon: Icons.Droplets },
            { label: 'Wind', value: `${data.wind} km/h`, icon: Icons.Wind },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1a1a2e] rounded-xl p-2 border border-white/5">
              <stat.icon className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
              <div className="text-xs text-white font-medium">{stat.value}</div>
              <div className="text-[9px] text-white/30">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-white/40 mb-2 font-medium">5-Day Forecast</div>
        <div className="space-y-2">
          {data.forecast.map((day: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-[#1a1a2e] rounded-xl border border-white/5">
              <span className="text-xs text-white/60 w-10">{day.day}</span>
              <WeatherIcon type={day.icon} className="w-5 h-5" />
              <div className="flex gap-3">
                <span className="text-xs text-white font-medium">{day.high}°</span>
                <span className="text-xs text-white/30">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
