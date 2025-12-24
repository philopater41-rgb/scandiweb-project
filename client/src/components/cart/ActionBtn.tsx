interface ActionBtnProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  data?: string;
}

function ActionBtn({ text, onClick, data = 'cart-btn', type = 'button' }: ActionBtnProps) {
  return (
    <button
      type={type}
      className="flex items-center justify-center w-6 h-6 transition-colors border border-text hover:bg-text hover:text-white"
      onClick={onClick}
      data-testid={data}
    >
      {text}
    </button>
  );
}

export default ActionBtn;
