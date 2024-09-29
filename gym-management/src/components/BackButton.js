import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const BackButton = () => {
    const navigate = useNavigate();
  
    return (
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-2">
        Volver
      </Button>
    );
  };

  export default BackButton;
  