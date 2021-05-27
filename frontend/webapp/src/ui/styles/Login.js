const LoginStyle = (theme) => ({
  appInfo: {
    background: "#392C71",
    minHeight: "100vh",
  },
  title: {
    width: "20%",
    height: "auto",
    margin: "90px 294px 148px 39px",
    fontSize: "1.875rem",
    fontWeight: "600",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.53",
    letterSpacing: "3.9px",
    textAlign: "left",
    color: theme.palette.primary.contrastText,
  },
  subTitle: {
    width: "80%",
    height: "auto",
    maxWidth: "280px",
    margin: "141px 70px 30px 39px",
    fontSize: "2rem",
    fontWeight: "500",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    color: theme.palette.primary.contrastText,
    "@media (max-width:1040px)": {
      fontSize: "1.5rem",
      letterSpacing: "1px",
      maxWidth: "280px",
    },
    "@media (min-width:1790px)": {
      fontSize: "2rem",
      width: "62%",
    },
  },
  body: {
    width: "80%",
    height: "auto",
    margin: "30px 0px 50px 39px",
    fontFamily: "Lato",
    fontSize: "0.7rem",
    fontWeight: "normal",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    color: "#f2f2f4",
    "@media (max-width:1040px)": {
      fontSize: "0.75rem",
      letterSpacing: "1px",
      maxWidth: "280px",
    },
    "@media (min-width:1790px)": {
      fontSize: ".9rem",
      width: "80%",
    },
  },
  expButton: {
    background: theme.palette.primary.contrastText,
    marginLeft: "39px",
  },
  parent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  loginGrid: {
    width: "33%",
    flexDirection: "column",
    display: "flex",
    height: "auto",
    verticalAlign: "middle",
    "@media (max-width:850px)": {
      minWidth: "270px",
      width: "85%",
    },
  },
  body2: {
    fontWeight: "550",
    // fontFamily: "Poppins Medium",
    paddingBottom: "25px",
    opacity: "1",
    fontSize: "1.7rem",
    height: "37px",
    color: "0C0F0F",
  },
  fullWidth: {
    width: "100%",
    marginTop: "20px",
    textAlign: "Left",
  },
  line: {
    flexDirection: "row",
    display: "flex",
  },
  gmailStyle: {
    width: "100%",
    marginTop: "20px",
    background: theme.palette.primary.contrastText,
  },
  linkedStyle: {
    width: "100%",
    marginTop: "20px",
    background: "#0E67C2",
    color: theme.palette.primary.contrastText,
  },
  githubStyle: {
    width: "100%",
    marginTop: "20px",
    background: "black",
    color: theme.palette.primary.contrastText,
  },
  labelWidth: {
    width: "100%",
  },
  dividerFullWidth: {
    margin: `40px 0 0 0`,
    width: "43%",
  },
  divider: {
    color: "#0c0f0f",
    marginTop: "32px",
    padding: "0 4% 0 5%",
    opacity: "56%",
  },
  createLogin: {
    marginTop: "10%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row" /* change this to row instead of 'column' */,
    flexWrap: "wrap",
    width: "100%",
  },
  width: {
    marginRight: "25px",
  },
  forgotPassword: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  forgoLink: {
    textAlign: "right",
    paddingTop: "10px",
  },
  link: {
    cursor: "pointer",
    width: "100%",
    color: "#922D88",
    float: "right",
  },
  subText: {
    marginTop: "-20px",
    opacity: "0.7",
  },
  loginLink: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginTop: "20px",
    alignItems: "flex-end",
  },

  textField: {
    width: "100%",
    marginTop: "20px",
  },
  passwordHint: {
    opacity: "0.5",
    marginTop: "10px",
  },
  privatePolicy: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  policy: {
    marginTop: "10px",
    marginLeft: "-10px",
  },
  footer: {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "25%",
    bottom: "0",
    height: "80px",
    width: "75%",
    "@media (max-width:600px)": {
      left: "0",
      width: "100%",
      padding: "0",
    },
    "@media (max-width: 1000px) and (min-width: 600px)": {
      left: "34%",
      width: "66%",
    },
  },
  typoDiv: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    "@media (max-width:900px)": {
      flexDirection: "column",
    },
  },
  typoFooter: { opacity: "0.5", marginTop: "10px" },
  typoBold: { fontWeight: "bold", marginLeft: "3px", marginTop: "10px" },
});
export default LoginStyle;
