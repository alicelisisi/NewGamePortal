import * as React from 'react';

import * as firebase from 'firebase';
import { ourFirebase } from '../services/firebase';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { History } from 'history';
import { Redirect } from 'react-router';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
const data = require('../countrycode.json');

interface Country {
  name: string;
  code: string;
  callingCode: string;
}

interface Props {
  myUserId: string;
  history: History;
}

enum loadingType {
  loading = 'loading',
  hide = 'hide'
}
// Todo: add all countries
/*
TODO:
I think that a lot of users don't even know their country code 
(e.g., I remember I only learned about Israel international code +972 when I first went abroad :))
We should probably break the phone number into: country + national number
So in the UI we should first show a drop down with all countries:
https://en.wikipedia.org/wiki/List_of_country_calling_codes

We should also have a JSON that we can later use to map country code ("IL") to calling code (+972), and vice versa.
We should also check the number is valid and it's a mobile number before allowing to click on "Send code", see:
https://yoav-zibin.github.io/FirebaseExample/libphonenumber/demo-compiled.html

Try login flow for WhatsApp or Duo (take screenshots along the way), and you'll understand what I mean :)

I found the mapping of calling code to country code :)
Please use it, and show a drop down that allows you to select the country.
The drop down should show the country  calling code + country name (in that language) + flag
E.g.,
(+1) United States
(+972) ישראל

etc :)
Do some research to see if you can use an existing package, see:
https://stackoverflow.com/questions/18099370/select2-drop-down-for-countries-with-flags

Also validate the phone number is a valid mobile number (before sending to firebase), see:
https://yoav-zibin.github.io/FirebaseExample/libphonenumber/demo-compiled.html
*/
/*
interface CallingCodeToCountryCodes {
  [callingCode: number]: string[];
}
// TODO: use it.
const callingCodeToCountryCodes: CallingCodeToCountryCodes = {
  1: 'US AG AI AS BB BM BS CA DM DO GD GU JM KN KY LC MP MS PR SX TC TT VC VG VI'.split(
    ' '
  ),
  7: ['RU', 'KZ'],
  20: ['EG'],
  27: ['ZA'],
  30: ['GR'],
  31: ['NL'],
  32: ['BE'],
  33: ['FR'],
  34: ['ES'],
  36: ['HU'],
  39: ['IT', 'VA'],
  40: ['RO'],
  41: ['CH'],
  43: ['AT'],
  44: ['GB', 'GG', 'IM', 'JE'],
  45: ['DK'],
  46: ['SE'],
  47: ['NO', 'SJ'],
  48: ['PL'],
  49: ['DE'],
  51: ['PE'],
  52: ['MX'],
  53: ['CU'],
  54: ['AR'],
  55: ['BR'],
  56: ['CL'],
  57: ['CO'],
  58: ['VE'],
  60: ['MY'],
  61: ['AU', 'CC', 'CX'],
  62: ['ID'],
  63: ['PH'],
  64: ['NZ'],
  65: ['SG'],
  66: ['TH'],
  81: ['JP'],
  82: ['KR'],
  84: ['VN'],
  86: ['CN'],
  90: ['TR'],
  91: ['IN'],
  92: ['PK'],
  93: ['AF'],
  94: ['LK'],
  95: ['MM'],
  98: ['IR'],
  211: ['SS'],
  212: ['MA', 'EH'],
  213: ['DZ'],
  216: ['TN'],
  218: ['LY'],
  220: ['GM'],
  221: ['SN'],
  222: ['MR'],
  223: ['ML'],
  224: ['GN'],
  225: ['CI'],
  226: ['BF'],
  227: ['NE'],
  228: ['TG'],
  229: ['BJ'],
  230: ['MU'],
  231: ['LR'],
  232: ['SL'],
  233: ['GH'],
  234: ['NG'],
  235: ['TD'],
  236: ['CF'],
  237: ['CM'],
  238: ['CV'],
  239: ['ST'],
  240: ['GQ'],
  241: ['GA'],
  242: ['CG'],
  243: ['CD'],
  244: ['AO'],
  245: ['GW'],
  246: ['IO'],
  247: ['AC'],
  248: ['SC'],
  249: ['SD'],
  250: ['RW'],
  251: ['ET'],
  252: ['SO'],
  253: ['DJ'],
  254: ['KE'],
  255: ['TZ'],
  256: ['UG'],
  257: ['BI'],
  258: ['MZ'],
  260: ['ZM'],
  261: ['MG'],
  262: ['RE', 'YT'],
  263: ['ZW'],
  264: ['NA'],
  265: ['MW'],
  266: ['LS'],
  267: ['BW'],
  268: ['SZ'],
  269: ['KM'],
  290: ['SH', 'TA'],
  291: ['ER'],
  297: ['AW'],
  298: ['FO'],
  299: ['GL'],
  350: ['GI'],
  351: ['PT'],
  352: ['LU'],
  353: ['IE'],
  354: ['IS'],
  355: ['AL'],
  356: ['MT'],
  357: ['CY'],
  358: ['FI', 'AX'],
  359: ['BG'],
  370: ['LT'],
  371: ['LV'],
  372: ['EE'],
  373: ['MD'],
  374: ['AM'],
  375: ['BY'],
  376: ['AD'],
  377: ['MC'],
  378: ['SM'],
  380: ['UA'],
  381: ['RS'],
  382: ['ME'],
  383: ['XK'],
  385: ['HR'],
  386: ['SI'],
  387: ['BA'],
  389: ['MK'],
  420: ['CZ'],
  421: ['SK'],
  423: ['LI'],
  500: ['FK'],
  501: ['BZ'],
  502: ['GT'],
  503: ['SV'],
  504: ['HN'],
  505: ['NI'],
  506: ['CR'],
  507: ['PA'],
  508: ['PM'],
  509: ['HT'],
  590: ['GP', 'BL', 'MF'],
  591: ['BO'],
  592: ['GY'],
  593: ['EC'],
  594: ['GF'],
  595: ['PY'],
  596: ['MQ'],
  597: ['SR'],
  598: ['UY'],
  599: ['CW', 'BQ'],
  670: ['TL'],
  672: ['NF'],
  673: ['BN'],
  674: ['NR'],
  675: ['PG'],
  676: ['TO'],
  677: ['SB'],
  678: ['VU'],
  679: ['FJ'],
  680: ['PW'],
  681: ['WF'],
  682: ['CK'],
  683: ['NU'],
  685: ['WS'],
  686: ['KI'],
  687: ['NC'],
  688: ['TV'],
  689: ['PF'],
  690: ['TK'],
  691: ['FM'],
  692: ['MH'],
  800: ['001'],
  808: ['001'],
  850: ['KP'],
  852: ['HK'],
  853: ['MO'],
  855: ['KH'],
  856: ['LA'],
  870: ['001'],
  878: ['001'],
  880: ['BD'],
  881: ['001'],
  882: ['001'],
  883: ['001'],
  886: ['TW'],
  888: ['001'],
  960: ['MV'],
  961: ['LB'],
  962: ['JO'],
  963: ['SY'],
  964: ['IQ'],
  965: ['KW'],
  966: ['SA'],
  967: ['YE'],
  968: ['OM'],
  970: ['PS'],
  971: ['AE'],
  972: ['IL'],
  973: ['BH'],
  974: ['QA'],
  975: ['BT'],
  976: ['MN'],
  977: ['NP'],
  979: ['001'],
  992: ['TJ'],
  993: ['TM'],
  994: ['AZ'],
  995: ['GE'],
  996: ['KG'],
  998: ['UZ']
};
*/
/*
const testCountries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    callingCode: '+1'
  },
  {
    name: 'Brazil',
    code: 'BR',
    callingCode: '+55'
  },
  {
    name: 'China',
    code: 'CN',
    callingCode: '+86'
  },
  {
    name: 'Colombia',
    code: 'CO',
    callingCode: '+57'
  }
];
*/
const style: React.CSSProperties = {
  margin: 20,
  padding: 10
};

class Login extends React.Component<Props, {}> {
  confirmationResult: any = null;
  state = {
    selectField: { value: '', label: '' },
    code: '',
    phoneNum: '',
    veriCode: '',
    errorText: '',
    veriErrorText: '',
    confirmationResult: null,
    veriDisabled: true,
    status: loadingType.hide
  };

  handleChange = (selectedOption: any) => {
    this.setState({
      selectField: selectedOption,
      code: selectedOption.value ? selectedOption.value : ''
    });
    console.log(`Selected: ${selectedOption.label}`);
  };

  handleInput = (event: any) => {
    if (!event.target.value) {
      this.setState({
        phoneNum: event.target.value,
        errorText: 'This field is required'
      });
    } else {
      this.setState({ phoneNum: event.target.value, errorText: '' });
    }
  };

  handleCodeInput = (event: any) => {
    if (!event.target.value) {
      this.setState({
        veriCode: event.target.value,
        veriErrorText: 'This field is required'
      });
    } else {
      this.setState({
        veriCode: event.target.value,
        phoneNum: event.target.value,
        veriErrorText: ''
      });
    }
  };

  onLogin = () => {
    ourFirebase
      .signInWithPhoneNumber(
        this.state.phoneNum,
        this.state.code,
        new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible'
        })
      )
      .then((_confirmationResult: any) => {
        this.confirmationResult = _confirmationResult;
      });

    this.setState({ veriDisabled: false });
  };

  sendCode = () => {
    this.confirmationResult
      .confirm(this.state.veriCode)
      .then((result: any) => {
        console.log('User signed in successfully: ', result.user);
        this.goToMainPage();
      })
      .catch((error: any) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(error);
      });
    this.setState({ status: loadingType.loading });
  };

  goToMainPage() {
    this.props.history.push('/');
  }

  render() {
    const selectField = this.state.selectField;
    const value = selectField && selectField.value;
    if (this.props.myUserId) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div style={style}>
          <div id="recaptcha-container" />

          <Select
            name="Select Country"
            value={value}
            onChange={this.handleChange}
            options={data.map((country: Country) => ({
              value: country.code,
              label: country.name + '(+' + country.callingCode + ')'
            }))}
          />

          <br />
          <TextField
            id="phoneNum"
            hintText="Enter your phone number"
            errorText={this.state.errorText}
            onChange={this.handleInput}
          />
          <br />
          <br />
          <RaisedButton
            label="get verification code"
            primary={true}
            onClick={this.onLogin}
          />
          <br />
          <br />
          <TextField
            id="veriCode"
            hintText="Enter your verification code"
            errorText={this.state.veriErrorText}
            onChange={this.handleCodeInput}
            disabled={this.state.veriDisabled}
          />
          <br />
          <br />
          <RaisedButton
            label="Login"
            primary={true}
            onClick={this.sendCode}
            disabled={this.state.veriDisabled}
          />
        </div>
        <RefreshIndicator
          size={50}
          left={window.screen.width / 2}
          top={window.screen.height / 2}
          loadingColor="#FF9800"
          status={this.state.status}
        />
      </div>
    );
  }
}

import { connect } from 'react-redux';
import { StoreState } from '../types/index';

const mapStateToProps = (state: StoreState) => ({
  myUserId: state.myUser.myUserId
});
export default connect(mapStateToProps)(Login);
