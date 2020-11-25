import agent from './agent';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from "@material-ui/core/styles";

/* Search Bar */
import { useDebounce } from './debounce';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button'


const useStyles = makeStyles((theme) => ({
    mainContainer: {
        marginTop: '10%',
    },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
  },
    inputField:{
      marginBottom: 24,
      width: '400px',
      maxWidth: 450
    },
  gridList: {
    width: 500,
  },
  image: {
      filter: 'grayscale(50%)',
      transition: 'filter .25s linear',
      "&:hover": {
          filter: 'grayscale(0)',
      }
  },
    icon: {
        color: '#979797'
    },
    clearButton: {
        marginLeft: theme.spacing(1)
    }
}));



export default function InfiniteScroll() {
    const classes = useStyles();

    const [data, setData] = useState({body: []});
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const [input, setInput] = useState(null);
    const debouncedQuery = useDebounce(input, 250);


    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setIsFetching(true);
    }

    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchData();
    }, [isFetching]);


    useEffect(() => {
        if (!debouncedQuery) return;
        fetchQuery();
    }, [debouncedQuery]);

    async function fetchQuery(reset = false) {
        const result = await agent.Images.get(1, !reset ? debouncedQuery : null);
        if (!!result.body && !!result.body.length) {
            setData({body: [...result.body]});
            setIsFetching(false);
            setPage(page + 1);
            setNoResults(false);
        }
        if (!!result.body && !result.body.length) {
            setNoResults(true);
        }
    }

    async function fetchData() {
        const result = await agent.Images.get(page, debouncedQuery);
        if (!!result.body && !!result.body.length) {
            setData({body: [...data.body, ...result.body]});
            setPage(page + 1);
            setIsFetching(false);
        }
    }

    function Loading() {
        return(
            <div style={{top: '46%', left: '43%', position: 'absolute'}}>
                <ReactLoading type={"cubes"} color={"#dc004e"}/>
            </div>
        )
    }

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleClick = () => {
        setInput(null);
        fetchQuery(true);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.root}>
                <TextField
                    className={classes.inputField}
                    label='Search'
                    onChange={handleChange}
                    value={input || ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ImageSearchIcon className={classes.icon} />
                            </InputAdornment>
                        )
                    }}
                    />
                {!!debouncedQuery &&
                    <Button
                        className={classes.clearButton}
                        onClick={handleClick}>
                            Clear
                    </Button>}
            </div>
            <div className={classes.root}>
                {!noResults ?
                    <GridList cellHeight={160} className={classes.gridList} cols={3}>
                        {
                            !!data.body.length ? data.body.map((tile, index) => (
                                    <GridListTile key={index} cols={(index % 10) ? 1 : 3} rows={(index % 20) ? 1 : 2}>
                                        <img className={classes.image} src={tile} alt="none"/>
                                    </GridListTile>
                                ))
                                :
                                <Loading/>
                        }
                    </GridList>
                    :
                    <p>No Results Found!</p>
                }
                { (!!isFetching && !data.body.length) &&
                    <Loading/>}
            </div>
        </div>
    )

}