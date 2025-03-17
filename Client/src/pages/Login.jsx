import { Alert, Button , Form , Row , Col , Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Login = () => {

    const { 
        loginUser,
        LoginError,
        loginInfo,
        updateLoginInfo,
        } = useContext(AuthContext);
    return <>
    <Form onSubmit={loginUser}>
        <Row style={{
            height:"100vh",
            justifyContent:"center",
            paddingTop : "10%",
        }}>
            <Col xs={6}>
            <Stack gap={3}>
                <h2>Đăng nhập</h2>
                
                <Form.Control 
                type="email" 
                placeholder="Email" 
                onChange={(e)=> updateLoginInfo({...loginInfo, email:e.target.value})}
                 />
                <Form.Control type="password" placeholder="Mật khẩu"  onChange={(e)=> updateLoginInfo({...loginInfo, password:e.target.value})} />
                <Button variant="primary" type="submit" >
                 Đăng nhập
                </Button>

                {
                    LoginError?.error &&(
                         <Alert variant="danger">
                    <p>
                        {LoginError?.message}   
                    </p>
                </Alert>
                )}
                    
            </Stack>
            </Col>
        </Row>
    </Form>
    </>  ;
}
 
export default Login;