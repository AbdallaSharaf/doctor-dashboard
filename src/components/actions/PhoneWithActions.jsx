import { faPhone, faCopy } from '@fortawesome/free-solid-svg-icons'; // import icons
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PhoneWithActions = ({ phone, id, handleReply, handleCopyPhone, isHovered }) => {
  return (
    <div className="relative inline-block">
      {/* Phone Number */}
      <span className="text-blue-500 cursor-pointer">{phone}</span>
      
      {/* Tooltip with Buttons */}
      {isHovered === id && (
        <div className="absolute left-0 bottom-[140%] mt-2 py-1 bg-black shadow-lg dark:bg-primary-bg z-10">
          {/* Tooltip Triangle */}
          <div className="absolute left-1/2  transform -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-[12px] border-r-[12px] border-t-[15px] border-transparent border-t-black dark:border-t-primary-bg z-20" />
          
          <div className="flex items-center justify-center gap-3 mx-4">
            {/* Call Reply */}
            <button
              onClick={() => handleReply('call', phone)}
              className="text-blue-500 hover:text-blue-600 text-lg"
            >
              <FontAwesomeIcon icon={faPhone} />
            </button>
            
            {/* WhatsApp Reply */}
            <button
              onClick={() => handleReply('whatsapp', phone)}
              className="text-green-500 hover:text-green-600 text-lg"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </button>

            {/* Copy Phone Number */}
            <button
              onClick={() => handleCopyPhone(phone)}
              className="text-gray-500 hover:text-gray-600 text-lg"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneWithActions;
