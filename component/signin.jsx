
import PropTypes from 'prop-types';
import Button from './Button';
export default function SigninComponent() {

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <a
          href="#"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
        >
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">Sign in</div>
            </div>
            <div className="pt-2">
              <LabelledInput id="username" label="Username" placeholder="harkirat@gmail.com" />
              <LabelledInput id="password" label="Password" type="password" placeholder="123456" />
            
            </div>
            <div>
                <Button/>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function LabelledInput({ id, label, placeholder, type }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        type={type || 'text'}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

// Define PropTypes for LabelledInput
LabelledInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};
