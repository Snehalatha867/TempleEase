import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  CameraOff, 
  Footprints, 
  Users, 
  Leaf, 
  HeartHandshake, 
  Accessibility, 
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const GuidelinesPage: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First one expanded by default

  const guidelinesList = [
    {
      title: 'Dress Code',
      subtitle: 'Wear traditional and modest clothing',
      icon: ShieldCheck,
      details: [
        'Men: Traditional Dhoti (Veshti) with Angavastram, or Kurta-Pyjama. Strictly no shorts, jeans, or casual t-shirts.',
        'Women: Traditional Saree, Half-saree (Langa Voni), or Chudidar/Salwar Kameez with properly pinned Dupatta.',
        'Western outfits including miniskirts, sleeveless tops, and gym wear are not permitted in the inner darshan lines.',
        'Children above 12 years are expected to follow the traditional dress code.'
      ]
    },
    {
      title: 'Temple Rules',
      subtitle: 'Maintain silence and discipline inside the temple',
      icon: Sparkles,
      details: [
        'Maintain reverence and solemn silence inside the Garbha Griha (Sanctum Sanctorum).',
        'Mobile phones must be switched off or deposited at the electronic token cloakrooms before entering queue lines.',
        'Smoking, alcohol, tobacco, and non-vegetarian food are strictly banned within a 5 km perimeter of the temple.',
        'Follow instructions issued by Temple Sevaks and security personnel.'
      ]
    },
    {
      title: 'Photography',
      subtitle: 'Photography is not allowed inside the sanctum',
      icon: CameraOff,
      details: [
        'Photography, videography, and drone cameras are strictly prohibited inside the Rajagopuram and inner sanctum.',
        'Non-commercial photography is permitted only in the outer gardens and hill viewing points.',
        'Any unauthorized filming inside prayer mandapams will result in confiscation of equipment by temple security.'
      ]
    },
    {
      title: 'Footwear',
      subtitle: 'Keep footwear in designated areas',
      icon: Footprints,
      details: [
        'All footwear must be deposited at the free token shoe counters located at the North and East approach plazas.',
        'Safeguard your metal brass token for quick retrieval upon exit.',
        'Running water channels are provided at temple gates to wash and purify feet before stepping onto sanctified flagstones.'
      ]
    },
    {
      title: 'Queue Discipline',
      subtitle: 'Follow queue lines and be patient',
      icon: Users,
      details: [
        'Remain patiently in your allotted Vaikuntham queue compartment.',
        'Complimentary drinking water, hot milk for infants, and restrooms are available inside every compartment.',
        'Do not rush, push, or leap across queue dividers when compartment gates open.',
        'Special priority lines are available at Gate 3 for seniors (65+) and Divyangjan devotees.'
      ]
    },
    {
      title: 'Cleanliness',
      subtitle: 'Keep the temple premises clean',
      icon: Leaf,
      details: [
        'The temple operates under a strict Zero-Single-Use-Plastic policy. Please carry reusable cloth bags.',
        'Segregated waste bins (Dry & Wet) are installed every 25 meters across the courtyards.',
        'Do not throw plastic wraps, flowers, or leftover food into the sacred Pushkarini water tank.'
      ]
    },
    {
      title: 'Behaviour',
      subtitle: 'Show respect to temple staff and other devotees',
      icon: HeartHandshake,
      details: [
        'Treat fellow pilgrims, archakas, and temple volunteers with humility and courtesy.',
        'Offer queue assistance to the elderly, mothers with toddlers, and differently-abled devotees.',
        'Refrain from loud arguments, soliciting donations, or unauthorized commercial activities inside temple grounds.'
      ]
    },
    {
      title: 'Special Assistance',
      subtitle: 'Facilities available for elderly and differently-abled visitors',
      icon: Accessibility,
      details: [
        'Free ergonomic wheelchairs with attendant volunteers are available at the Central Enquiry Desk.',
        'Eco-friendly battery-operated buggies continuously ferry seniors between parking lots and temple gates free of cost.',
        'Dedicated baby-feeding cubicles and first-aid medical beds are stationed at Amenities Complex 1.'
      ]
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb matching Reference 10 */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E87325] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Visitor Guidelines</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
          Visitor Guidelines
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Follow these guidelines for a safe and pleasant visit
        </p>
      </div>

      {/* Clean Interactive Accordion List matching Reference 10 */}
      <div className="space-y-3">
        {guidelinesList.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={item.title}
              className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-[#E87325]' : 'border-[#E5DCCE] hover:border-[#E87325]/50'
              }`}
            >
              {/* Accordion Row Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded ? 'bg-[#E87325] text-white' : 'bg-[#FFF5EE] text-[#E87325]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3A1412]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-stone-400 pl-2">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-[#E87325]" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Accordion Expandable Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#F4EFE6] bg-[#FAF7F2]/50 animate-in fade-in duration-200">
                  <ul className="space-y-2.5 text-xs text-stone-700 pt-3">
                    {item.details.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
