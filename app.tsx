import React, { useState, useMemo } from 'react';
import { Car, Home, Plus, MessageCircle, User, FileText, Fuel, Wrench, Calendar, AlertTriangle, TrendingUp, Camera, Upload, X, Check, ChevronRight, Bell, Settings, Download, Share2, Search, Menu } from 'lucide-react';

const SuperDriveApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      plate: 'ABC1D23',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      odoKm: 45200,
      healthScore: 87,
      lastUpdate: new Date('2024-10-15'),
      fuelType: 'Gasolina',
      usage: 'urbano'
    }
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [activeTab, setActiveTab] = useState('saude');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [maintenanceEvents, setMaintenanceEvents] = useState([
    { id: 1, vehicleId: 1, type: 'Troca de Óleo', date: '2024-08-10', odoKm: 42000, price: 25000, vendor: 'Oficina Central', status: 'completed' },
    { id: 2, vehicleId: 1, type: 'Balanceamento', date: '2024-09-15', odoKm: 44000, price: 15000, vendor: 'Auto Pneus', status: 'completed' }
  ]);
  const [fuelLogs, setFuelLogs] = useState([
    { id: 1, vehicleId: 1, date: '2024-10-18', liters: 45, price: 31500, odoKm: 45150, fullTank: true, kml: 11.2 },
    { id: 2, vehicleId: 1, date: '2024-10-10', liters: 42, price: 29400, odoKm: 44680, fullTank: true, kml: 11.4 },
    { id: 3, vehicleId: 1, date: '2024-10-02', liters: 40, price: 28000, odoKm: 44200, fullTank: true, kml: 12.0 }
  ]);
  const [reminders, setReminders] = useState([
    { id: 1, vehicleId: 1, type: 'Troca de Óleo', dueKm: 48000, dueDate: new Date('2024-11-15'), risk: 'low' },
    { id: 2, vehicleId: 1, type: 'Revisão 50.000km', dueKm: 50000, dueDate: new Date('2024-12-20'), risk: 'medium' },
    { id: 3, vehicleId: 1, type: 'IPVA 2025', dueKm: null, dueDate: new Date('2025-01-31'), risk: 'high' }
  ]);

  const calculateKmRemaining = (dueKm) => {
    if (!dueKm || !selectedVehicle) return null;
    return dueKm - selectedVehicle.odoKm;
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const avgKml = useMemo(() => {
    if (fuelLogs.length === 0) return 0;
    const sum = fuelLogs.reduce((acc, log) => acc + log.kml, 0);
    return (sum / fuelLogs.length).toFixed(1);
  }, [fuelLogs]);

  const totalSpent = useMemo(() => {
    const fuel = fuelLogs.reduce((acc, log) => acc + log.price, 0);
    const maint = maintenanceEvents.reduce((acc, evt) => acc + evt.price, 0);
    return ((fuel + maint) / 100).toFixed(2);
  }, [fuelLogs, maintenanceEvents]);

  // Components
  const Header = ({ title, action }) => (
    <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      {action}
    </div>
  );

  const BottomNav = () => {
    const navItems = [
      { id: 'home', icon: Home, label: 'Início' },
      { id: 'vehicles', icon: Car, label: 'Veículos' },
      { id: 'register', icon: Plus, label: 'Registrar' },
      { id: 'assistant', icon: MessageCircle, label: 'Assistente' },
      { id: 'profile', icon: User, label: 'Perfil' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === item.id ? 'text-green-700' : 'text-gray-500'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const ScoreGauge = ({ score }) => {
    const angle = (score / 100) * 180;
    const color = score >= 80 ? '#2E7D32' : score >= 60 ? '#FFB300' : '#C62828';
    
    return (
      <div className="relative w-32 h-20 mx-auto">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${angle * 1.4} 1000`}
            className="transition-all duration-500"
          />
          <text x="50" y="45" textAnchor="middle" className="text-2xl font-bold" fill={color}>
            {score}
          </text>
        </svg>
      </div>
    );
  };

  // Pages
  const HomePage = () => (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <Header 
        title="SuperDrive.ai" 
        action={
          <button className="p-2" onClick={() => setCurrentPage('notifications')}>
            <Bell size={24} />
          </button>
        }
      />
      
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-500">Veículo Principal</h2>
            <button onClick={() => setShowOnboarding(true)} className="text-blue-600 text-sm font-medium">
              + Adicionar
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{selectedVehicle.make} {selectedVehicle.model}</h3>
              <p className="text-gray-600 text-sm">{selectedVehicle.plate} • {selectedVehicle.year}</p>
              <p className="text-gray-500 text-xs mt-1">{selectedVehicle.odoKm.toLocaleString('pt-BR')} km</p>
            </div>
            <Car className="text-green-700" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="mr-2 text-green-700" size={20} />
            Score de Saúde
          </h3>
          <ScoreGauge score={selectedVehicle.healthScore} />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">Motor</p>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">Freios</p>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">Docs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20} />
              Próximas Ações
            </h3>
            <button onClick={() => setCurrentPage('planner')} className="text-blue-600 text-sm">
              Ver todas
            </button>
          </div>
          {reminders.slice(0, 3).map(reminder => {
            const kmLeft = calculateKmRemaining(reminder.dueKm);
            const daysLeft = calculateDaysRemaining(reminder.dueDate);
            return (
              <div key={reminder.id} className={`border rounded-lg p-3 mb-2 ${getRiskColor(reminder.risk)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{reminder.type}</p>
                    <div className="text-xs mt-1 space-y-1">
                      {kmLeft && <p>Em {kmLeft.toLocaleString('pt-BR')} km</p>}
                      {daysLeft && <p>Em {daysLeft} dias</p>}
                    </div>
                  </div>
                  <AlertTriangle size={18} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center">
            <Fuel className="mr-2 text-amber-600" size={20} />
            Consumo & Gastos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-green-700">{avgKml}</p>
              <p className="text-xs text-gray-600">km/L médio</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">R$ {totalSpent}</p>
              <p className="text-xs text-gray-600">Gastos totais</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Recall Identificado</h4>
              <p className="text-sm text-amber-800">Identificamos um recall para seu Honda Civic 2020. Recomenda-se inspeção na concessionária.</p>
              <button className="mt-2 text-sm text-amber-900 font-medium underline">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OnboardingPage = () => {
    const [step, setStep] = useState('method');
    const [formData, setFormData] = useState({ plate: '', make: '', model: '', year: '', odoKm: '' });

    return (
      <div className="pb-20 bg-white min-h-screen">
        <Header 
          title="Adicionar Veículo" 
          action={
            <button onClick={() => setShowOnboarding(false)}>
              <X size={24} />
            </button>
          }
        />
        
        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Como deseja cadastrar?</h2>
              
              <button className="w-full border-2 border-blue-600 rounded-lg p-6 text-left hover:bg-blue-50 transition">
                <div className="flex items-center">
                  <Camera className="text-blue-600 mr-4" size={32} />
                  <div>
                    <h3 className="font-semibold text-lg">Fotografar CRLV</h3>
                    <p className="text-sm text-gray-600">Reconhecimento automático dos dados</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setStep('manual')}
                className="w-full border-2 border-gray-300 rounded-lg p-6 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center">
                  <FileText className="text-gray-600 mr-4" size={32} />
                  <div>
                    <h3 className="font-semibold text-lg">Digitar Placa</h3>
                    <p className="text-sm text-gray-600">Preenchimento manual dos dados</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'manual' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Dados do Veículo</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placa</label>
                <input
                  type="text"
                  placeholder="ABC1D23"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <input
                    type="text"
                    placeholder="Honda"
                    value={formData.make}
                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                  <input
                    type="text"
                    placeholder="Civic"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Km Atual</label>
                  <input
                    type="number"
                    placeholder="45000"
                    value={formData.odoKm}
                    onChange={(e) => setFormData({...formData, odoKm: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Uso</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                  <option>Urbano</option>
                  <option>Rodoviário</option>
                  <option>Misto</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  const newVehicle = {
                    id: vehicles.length + 1,
                    plate: formData.plate,
                    make: formData.make,
                    model: formData.model,
                    year: parseInt(formData.year),
                    odoKm: parseInt(formData.odoKm),
                    healthScore: 95,
                    lastUpdate: new Date(),
                    fuelType: 'Gasolina',
                    usage: 'urbano'
                  };
                  setVehicles([...vehicles, newVehicle]);
                  setSelectedVehicle(newVehicle);
                  setShowOnboarding(false);
                  setCurrentPage('home');
                }}
                className="w-full bg-green-700 text-white rounded-lg py-4 font-semibold text-lg hover:bg-green-800 transition mt-6"
              >
                Cadastrar Veículo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const VehicleDetailPage = () => {
    const tabs = [
      { id: 'saude', label: 'Saúde', icon: TrendingUp },
      { id: 'manutencoes', label: 'Manutenções', icon: Wrench },
      { id: 'consumo', label: 'Consumo', icon: Fuel },
      { id: 'documentos', label: 'Documentos', icon: FileText }
    ];

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <Header title="Detalhe do Veículo" />
        
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6">
          <h2 className="text-2xl font-bold">{selectedVehicle.make} {selectedVehicle.model}</h2>
          <p className="text-green-100">{selectedVehicle.plate} • {selectedVehicle.year}</p>
          <p className="text-green-200 text-sm mt-2">{selectedVehicle.odoKm.toLocaleString('pt-BR')} km</p>
        </div>

        <div className="flex bg-white border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'saude' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-center">Score de Saúde</h3>
                <ScoreGauge score={selectedVehicle.healthScore} />
                <p className="text-center text-sm text-gray-600 mt-4">
                  Seu veículo está em ótimo estado geral
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-3">Breakdown por Sistema</h4>
                {[
                  { name: 'Motor', score: 92, status: 'excellent' },
                  { name: 'Freios', score: 88, status: 'good' },
                  { name: 'Pneus', score: 85, status: 'good' },
                  { name: 'Documentos', score: 75, status: 'warning' }
                ].map(system => (
                  <div key={system.name} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{system.name}</span>
                      <span className="font-medium">{system.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          system.score >= 90 ? 'bg-green-600' :
                          system.score >= 80 ? 'bg-green-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${system.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'manutencoes' && (
            <div className="space-y-3">
              {maintenanceEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{event.type}</h4>
                      <p className="text-sm text-gray-600">{event.vendor}</p>
                    </div>
                    <Check className="text-green-600" size={20} />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                    <span>{event.odoKm.toLocaleString('pt-BR')} km</span>
                  </div>
                  <p className="text-right font-semibold text-green-700 mt-2">
                    R$ {(event.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'consumo' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-4">Média de Consumo</h4>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-700">{avgKml}</p>
                  <p className="text-gray-600">km/L</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-3">Histórico de Abastecimentos</h4>
                {fuelLogs.map(log => (
                  <div key={log.id} className="border-b last:border-b-0 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{log.liters}L</p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500">{log.odoKm.toLocaleString('pt-BR')} km</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {(log.price / 100).toFixed(2)}</p>
                        <p className="text-sm text-green-600">{log.kml} km/L</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-3">
              {[
                { name: 'CRLV 2024', status: 'valid', expires: '2025-01-31' },
                { name: 'IPVA 2025', status: 'pending', expires: '2025-01-31' },
                { name: 'Seguro', status: 'valid', expires: '2025-06-15' },
                { name: 'Licenciamento', status: 'valid', expires: '2025-01-31' }
              ].map((doc, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="text-blue-600 mr-3" size={24} />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-600">
                        Validade: {new Date(doc.expires).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'valid' ? 'bg-green-100 text-green-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status === 'valid' ? 'Válido' : 'Pendente'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="fixed bottom-20 right-4 bg-green-700 text-white rounded-full p-4 shadow-lg hover:bg-green-800 transition">
          <Plus size={24} />
        </button>
      </div>
    );
  };

  const PlannerPage = () => {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <Header title="Planner de Manutenção" />
        
        <div className="p-4 space-y-3">
          {reminders.map(reminder => {
            const kmLeft = calculateKmRemaining(reminder.dueKm);
            const daysLeft = calculateDaysRemaining(reminder.dueDate);
            
            return (
              <div key={reminder.id} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                reminder.risk === 'high' ? 'border-red-600' :
                reminder.risk === 'medium' ? 'border-amber-600' :
                'border-green-600'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{reminder.type}</h4>
                    <div className="mt-2 space-y-1">
                      {kmLeft !== null && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{kmLeft.toLocaleString('pt-BR')} km</span> restantes
                        </p>
                      )}
                      {daysLeft !== null && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{daysLeft} dias</span> restantes
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reminder.risk === 'high' ? 'bg-red-100 text-red-700' :
                    reminder.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {reminder.risk === 'high' ? 'Urgente' :
                     reminder.risk === 'medium' ? 'Atenção' : 'Ok'}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-green-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-800 transition">
                    Marcar como Feito
                  </button>
                  <button className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition">
                    Adiar
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Dica da IA</h4>
            <p className="text-sm text-blue-800">
              Baseado no seu uso urbano, recomendamos antecipar a troca de óleo para 5.000 km ao invés de 6.000 km.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const AssistantPage = () => {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Olá! Sou o assistente do SuperDrive. Como posso ajudar com seu veículo hoje?' }
    ]);
    const [input, setInput] = useState('');

    const quickSuggestions = [
      'Qual óleo usar?',
      'Barulho no freio',
      'Quando trocar correia?',
      'Como economizar combustível?'
    ];

    const handleSend = () => {
      if (!input.trim()) return;
      
      setMessages([...messages, 
        { role: 'user', content: input },
        { role: 'assistant', content: 'Entendo sua dúvida. Para o seu Honda Civic 2020, recomendo óleo sintético 5W-30, conforme especificação do fabricante. A troca deve ser realizada a cada 6.000 km ou 6 meses. Deseja agendar uma troca?' }
      ]);
      setInput('');
    };

    return (
      <div className="pb-20 bg-gray-50 min-h-screen flex flex-col">
        <Header title="Assistente Virtual" />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white shadow-sm'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs text-gray-500 text-center mb-3">Sugestões rápidas:</p>
              {quickSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="w-full bg-white rounded-lg p-3 text-left text-sm hover:bg-gray-50 transition shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button 
              onClick={handleSend}
              className="bg-green-700 text-white rounded-lg px-6 font-medium hover:bg-green-800 transition"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <Header title="Perfil" />
        
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="text-white" size={40} />
            </div>
            <h3 className="font-bold text-lg">João Silva</h3>
            <p className="text-gray-600 text-sm">joao.silva@email.com</p>
            <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
              Plano Free
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-sm">
            <h4 className="font-bold text-lg mb-2">Upgrade para Pro</h4>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center">
                <Check className="mr-2" size={16} />
                Lembretes por WhatsApp
              </li>
              <li className="flex items-center">
                <Check className="mr-2" size={16} />
                OCR ilimitado
              </li>
              <li className="flex items-center">
                <Check className="mr-2" size={16} />
                Relatórios PDF
              </li>
              <li className="flex items-center">
                <Check className="mr-2" size={16} />
                Até 5 veículos
              </li>
            </ul>
            <p className="text-2xl font-bold mb-4">R$ 14,90<span className="text-sm font-normal">/mês</span></p>
            <button className="w-full bg-white text-blue-700 rounded-lg py-3 font-semibold hover:bg-blue-50 transition">
              Assinar Agora
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm divide-y">
            {[
              { icon: Bell, label: 'Notificações', badge: null },
              { icon: Settings, label: 'Configurações', badge: null },
              { icon: Download, label: 'Exportar Dados', badge: null },
              { icon: FileText, label: 'Política de Privacidade', badge: null },
              { icon: Share2, label: 'Indicar para Amigos', badge: 'Ganhe 1 mês' }
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div className="flex items-center">
                  <item.icon className="text-gray-600 mr-3" size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.badge && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mr-2">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              </button>
            ))}
          </div>

          <button className="w-full text-red-600 font-medium py-3">
            Sair da Conta
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative font-sans">
      {showOnboarding ? (
        <OnboardingPage />
      ) : currentPage === 'home' ? (
        <HomePage />
      ) : currentPage === 'vehicles' ? (
        <VehicleDetailPage />
      ) : currentPage === 'planner' ? (
        <PlannerPage />
      ) : currentPage === 'assistant' ? (
        <AssistantPage />
      ) : currentPage === 'profile' ? (
        <ProfilePage />
      ) : (
        <HomePage />
      )}
      
      {!showOnboarding && <BottomNav />}
    </div>
  );
};

export default SuperDriveApp;
