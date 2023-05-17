import React from "react"
import {
    Form,
    Input,
    Select, 
    Spin,
    Icon,  
  
    Checkbox,
    Button,
    AutoComplete,
  } from 'antd';
import 'antd/dist/antd.css';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';

const antIcon = <Icon type="loading" style={{ fontSize:24 }} spin />;

  const { Option } = Select;
  const AutoCompleteOption = AutoComplete.Option;
  
  
  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.props.auth(values.username,values.email,values.password,values.confirm);
        }
      });
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };
  
    
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { autoCompleteResult } = this.state;
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
      })(
        <Select style={{ width: 70 }}>
          <Option value="86">+86</Option>
          <Option value="87">+87</Option>
        </Select>,
      );
  
      const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
      ));

      const usernameError = (errorName) => {
        
        if(this.props.error){
            if(this.props.error.hasOwnProperty(errorName))
            {
                return this.props.error[errorName].map(e => (
                    <p style={{ color:"red" }}>{e}</p>
                ) )
                
            }
            
        }
            
      }

  
      return (
        <div className="container">
            <div className="col-6 mx-auto mt-3">
                
             

            { this.props.loading ? 

                <Spin indicator={antIcon} />

                :
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            {usernameError("username")}       
           <Form.Item label="Username">
            {getFieldDecorator('username', {
              rules: [
               
                {
                  required: true,
                  message: 'Please input your username',
                },
              ],
            })(<Input />)}
          </Form.Item> 
          {usernameError("email")}
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          {usernameError("password1")}
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <strong>login if you have already signup </strong>
          <a className="btn btn-success" href="/login/">login</a>

            
          </Form.Item>
        </Form>

             }

            
            </div>
        </div>
       
      );
    }
  }
  
const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

const mapStateToProps = state =>{
  return{
      error: state.auth.error,
      loading:state.auth.loading,
      token: state.auth.token,
      

  }
}

const mapDispatchToProps = dispatch =>{
  return{
      auth: (username,email,password1,password2) => dispatch(actions.authSignup(username,email,password1,password2))
  }
}
  
export default connect(mapStateToProps,mapDispatchToProps)(WrappedRegistrationForm);