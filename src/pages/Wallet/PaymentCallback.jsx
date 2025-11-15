import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/services";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference");
    
    if (reference) {
      verifyPayment(reference)
        .then(() => {
          navigate("/wallet", { replace: true, state: { paymentSuccess: true } });
        })
        .catch(() => {
          navigate("/wallet", { replace: true, state: { paymentError: true } });
        });
    } else {
      navigate("/wallet", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <div className="spinner-border text-danger mb-3" role="status"></div>
        <p>Processing payment...</p>
      </div>
    </div>
  );
}