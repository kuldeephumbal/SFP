import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    InputBase,
    Box,
    Typography,
    TablePagination,
    Chip,
    Avatar,
    useTheme,
    useMediaQuery,
    Collapse,
    Button,
} from '@mui/material';
import {
    Search as SearchIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';

const BaseTable = ({
    columns,
    data,
    searchable = true,
    renderActions,
    title,
    loading = false,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 10,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [openRow, setOpenRow] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Filter data based on search
    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (val) =>
                val &&
                val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (index) => {
        setOpenRow(openRow === index ? null : index);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {searchable && (
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 400 },
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: 'none',
                        }}
                    >
                        <IconButton sx={{ p: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: 'white' }}
                            placeholder="Search table..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Paper>
                </Box>
            )}

            {!isMobile ? (
                /* Desktop/Tablet Table View */
                <TableContainer
                    sx={{
                        background: 'transparent',
                        boxShadow: 'none',
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative'
                    }}
                >
                    <Table sx={{ minWidth: 1000, tableLayout: 'auto' }}>
                        <TableHead>
                            <TableRow sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                        align={column.align || 'left'}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.05em',
                                            borderBottom: 'none',
                                            py: 2,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {column.headerName}
                                    </TableCell>
                                ))}
                                {renderActions && (
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.05em',
                                            borderBottom: 'none',
                                            py: 2,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, rowIndex) => (
                                <TableRow
                                    key={row._id || rowIndex}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                        },
                                        transition: 'background-color 0.2s ease',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.field}
                                            align={column.align || 'left'}
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                borderBottom: 'none',
                                                py: 2.5,
                                            }}
                                        >
                                            {column.renderCell ? column.renderCell(row) : row[column.field]}
                                        </TableCell>
                                    ))}
                                    {renderActions && (
                                        <TableCell
                                            align="right"
                                            sx={{
                                                borderBottom: 'none',
                                                py: 2.5,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                {renderActions(row)}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                /* Combined Mobile View (Accordion Style) */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                    {paginatedData.map((row, rowIndex) => (
                        <Paper
                            key={row._id || rowIndex}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                p: 2,
                                color: 'white'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'space-between',
                                gap: 2,
                                mb: 2
                            }}>
                                {columns.slice(0, 2).map((column, idx) => (
                                    <Box key={idx} sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                                            {column.headerName}
                                        </Typography>
                                        <Box sx={{
                                            color: 'white',
                                            '& img, & iframe': {
                                                maxWidth: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                border: 'none'
                                            },
                                            overflowWrap: 'anywhere',
                                            wordBreak: 'break-word'
                                        }}>
                                            {column.renderCell ? column.renderCell(row) : row[column.field]}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Collapse in={openRow === rowIndex}>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                    gap: 2,
                                    mt: 2,
                                    py: 2,
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    {columns.slice(2).map((column, idx) => (
                                        <Box key={idx} sx={{ minWidth: 0 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                                                {column.headerName}
                                            </Typography>
                                            <Box sx={{
                                                color: 'white',
                                                '& img': {
                                                    maxWidth: '100%',
                                                    height: 'auto !important',
                                                    borderRadius: '8px'
                                                }
                                            }}>
                                                {column.renderCell ? column.renderCell(row) : row[column.field]}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                                <Button
                                    size="small"
                                    onClick={() => handleRowClick(rowIndex)}
                                    color="primary"
                                    startIcon={openRow === rowIndex ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    sx={{ textTransform: 'none', color: '#60a5fa' }}
                                >
                                    {openRow === rowIndex ? 'Less info' : 'More info'}
                                </Button>
                                {renderActions && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {renderActions(row)}
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? "" : "Rows per page:"}
                sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    borderTop: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    '.MuiTablePagination-selectIcon': { color: 'rgba(255, 255, 255, 0.6)' },
                    '.MuiTablePagination-actions': { color: 'rgba(255, 255, 255, 0.6)' },
                    '.MuiTablePagination-selectRoot': { margin: '0 8px' },
                    '.MuiTablePagination-toolbar': isMobile ? {
                        px: 1,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 1
                    } : {
                        alignItems: 'baseline'
                    },
                    '.MuiTablePagination-selectLabel': isMobile ? { display: 'none' } : {},
                    '.MuiTablePagination-spacer': isMobile ? { display: 'none' } : {},
                    '.MuiTablePagination-displayedRows': isMobile ? {
                        margin: 0,
                        fontSize: '0.85rem'
                    } : {}
                }}
            />
        </Box>
    );
};

export default BaseTable;
