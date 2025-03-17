import {useContext} from "react";
import { Alert, Button , Form , Row , Col , Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
const Register = () => {
   const {registerInfo,
     updateRegisterInfo ,
     registerUser,
     registerError,
     isregisterLoading
    } = useContext(AuthContext);

    return (
    <>
    <Form onSubmit={registerUser}>
        <Row style={{
            height:"100vh",
            justifyContent:"center",
            paddingTop : "10%",
        }}>
            <Col xs={6}>
            <Stack gap={3}>
                <h2>Đăng ký tài khoản</h2>
               
                <Form.Control type="text" placeholder="Họ Tên" onChange={(e)=>updateRegisterInfo({...registerInfo,name:e.target.value})} />

                <Form.Control type="email" placeholder="Email"  onChange={(e)=>updateRegisterInfo({...registerInfo,email:e.target.value})} />
                <Form.Control type="password" placeholder="Mật khẩu"  onChange={(e)=>updateRegisterInfo({...registerInfo,password :e.target.value})} />
                <Button variant="primary" type="submit" >
                    
                    {
                        isregisterLoading ? "Vui lòng chờ..." : "Đăng ký"
                    }
                </Button>

                {
                    registerError?.error && <Alert variant="danger">
                    <p>
                        {registerError?.message}
                    </p>
                </Alert>
                }
                    

            </Stack>
            </Col>
        </Row>
    </Form>
    </>)  ;
}
 
export default Register;