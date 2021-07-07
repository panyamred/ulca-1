import { createMuiTheme } from "@material-ui/core/styles";

const themeDefault = createMuiTheme({
  typography: {
    fontFamily: '"Lato"',
    fontWeight: "600",
  },
  overrides: {
    MuiTableRow: {
      root: {
        cursor: "pointer",
        '&.MuiTableRow-hover:hover': {


          backgroundColor: "#F4F4FA"

        }



      },
      hover: {
        //   "&:hover": {
        //     color: '#2C2799',
        // backgroundColor: " rgba(44,39,153, .05)"
        // }

      }
    },
    MUIDataTableFilterList: {
      chip: {
        display: 'none'
      }
    },
    MuiMenu: {
      list: {
        minWidth: "210px"
      }
    },
    MUIDataTableFilter: {
      root: {
        backgroundColor: "white",
        width: "80%",
        fontFamily: '"lato" ,sans-serif',
      },
      checkboxFormControl: {
        minWidth: '200px'
      }
    },
    MuiList: {
      root: {
        fontFamily: '"lato" ,sans-serif',
      }

    },
    MUIDataTable: {
      paper: {
        minHeight: '674px',
        boxShadow: "0px 0px 2px #00000029",
        border: "1px solid #0000001F"
      },
      responsiveBase: {
        minHeight: "560px"
      }
    },
    MUIDataTableToolbar: {
      filterPaper: {
        width: "310px"
      },
      MuiButton: {
        root: {
          display: "none"
        }
      }

    },
    MuiGrid: {
      grid: {

        maxWidth: "100%"

      }
    },

    MuiTableCell: {
      head: {
        padding: ".6rem .5rem .6rem 1.5rem",
        backgroundColor: "#F8F8FA !important",
        marginLeft: "25px",
        letterSpacing: "0.74",
        fontWeight: "bold",
        minHeight: "700px",
      },
    },
    MUIDataTableHeadCell: {
      root: {
        "&:nth-child(1)": {
          width: "46%",
        },
        "&:nth-child(2)": {
          width: "18%",
        },
        "&:nth-child(3)": {
          width: "18%",
        },
        "&:nth-child(4)": {
          width: "18%",
        },
      },
    },

    // MuiTableFooter:{
    //   root:{

    //     "@media (min-width: 1050px)": {
    //       position:"absolute",
    //       right:"15%",
    //       top:"46.5rem",
    //       borderBottom:"1px"

    //     },

    //   }
    // },
    MuiPaper: {
      root: {
        boxShadow: "none !important",
        borderRadius: 0,
        border: "1px solid rgb(224 224 224)",
      },
    },
    MuiDialog: {
      paper: { minWidth: "360px", minHeight: "116px" }
    },
    MuiAppBar: {
      root: {
        boxSizing: "none",
        margin: "-1px",
        padding: "0px"
      }
    },
    MuiToolbar: {
      root: {
        padding: 0
      }
    },
    MuiFormControlLabel: {
      root: {
        height: '36px'
      },
      label: {
        fontFamily: '"lato" ,sans-serif',
        fontSize: '0.875rem'
      }

    },

    MUIDataTableBodyCell: {
      root: { padding: ".5rem .5rem .5rem .8rem", textTransform: "capitalize" },
    },
    MuiButton: {
      root: {
        minWidth: "25",
        borderRadius: "0",

      },
      label: {

        textTransform: "none",
        fontFamily: '"Lato"',
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "1.14",
        letterSpacing: "0.14px",
        textAlign: "center",
        height: "26px",
      },
      sizeLarge: {
        height: "48px",
      },
      sizeSmall: {
        height: "36px",
      },


    }

  },
  palette: {
    primary: {
      light: "#60568d",
      main: "#2C2799",
      dark: "#271e4f",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FFFFFF",
      main: "#FFFFFF",
      dark: "#FFFFFF",
      contrastText: "#000000",
    },
    background: {
      default: "#2C2799",
    },
  },
});

themeDefault.typography.h1 = {
  fontSize: "2.25rem",
  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
};
themeDefault.typography.h2 = {
  fontSize: "2rem",
  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
};
themeDefault.typography.h3 = {
  fontSize: "1.6875rem",
  letterSpacing: "1.98px",
  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
};
themeDefault.typography.h4 = {
  fontSize: "1.5rem",
  // letterSpacing: "1.98px",
  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
};
themeDefault.typography.h5 = {
  fontSize: "1.3125rem",

  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
};
themeDefault.typography.h6 = {
  fontSize: "1.125rem",
  fontFamily: '"Poppins","lato" ,sans-serif',
  fontWeight: "500",
  paddingTop: "4px"
};
themeDefault.typography.body1 = {
  fontSize: "1rem",
  fontFamily: '"lato" ,sans-serif',
  fontWeight: "400"

};
themeDefault.typography.body2 = {
  fontSize: "0.875rem",
  fontFamily: '"lato" ,sans-serif',
  fontWeight: "400",
  color: "#0C0F0F"
};
themeDefault.typography.caption = {
  fontSize: "0.75rem",
  fontFamily: '"lato" ,sans-serif',
  fontWeight: "400",
};
themeDefault.typography.subtitle1 = {
  fontSize: "1.125rem",
  fontFamily: '"lato" ,sans-serif',
  fontWeight: "600"
};


export default themeDefault;