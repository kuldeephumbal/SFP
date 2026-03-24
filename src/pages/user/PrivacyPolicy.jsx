import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography } from '@mui/material';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const foundationName = t('foundation_name');
    const opts = { foundation: foundationName };

    const sections = [
        { titleKey: 'privacy_policy.section_objective', contentKey: 'privacy_policy.objective_scope' },
        { titleKey: 'privacy_policy.section_user_consent', contentKey: 'privacy_policy.user_consent' },
        { titleKey: 'privacy_policy.section_collection', contentKey: 'privacy_policy.collection_use' },
        { titleKey: 'privacy_policy.section_info_provide', contentKey: 'privacy_policy.info_you_provide' },
        { titleKey: 'privacy_policy.section_info_mobile', contentKey: 'privacy_policy.info_mobile_app' },
        { titleKey: 'privacy_policy.section_info_voluntary', contentKey: 'privacy_policy.info_voluntary' },
        { titleKey: 'privacy_policy.section_info_auto', contentKey: 'privacy_policy.info_auto' },
        { titleKey: 'privacy_policy.section_info_other', contentKey: 'privacy_policy.info_other_sources' },
        { titleKey: 'privacy_policy.section_usage_mobile', contentKey: 'privacy_policy.usage_mobile' },
        { titleKey: 'privacy_policy.section_purposes', contentKey: 'privacy_policy.purposes_lawfulness' },
        { titleKey: 'privacy_policy.section_children', contentKey: 'privacy_policy.children_privacy' },
        { titleKey: 'privacy_policy.section_data_transfer', contentKey: 'privacy_policy.data_transfer' },
        { titleKey: 'privacy_policy.section_security', contentKey: 'privacy_policy.security_compliance' }
    ];

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                        {/* Header */}
                        <Box
                            sx={{
                                backgroundColor: '#1976d2',
                                color: 'white',
                                textAlign: 'center',
                                py: { xs: 1.5, sm: 2 },
                                mb: 4,
                                borderRadius: 1,
                                mx: { xs: -3, md: -4 },
                                mt: { xs: -3, md: -4 },
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {t('privacy_policy.title')}
                            </Typography>
                        </Box>

                        {/* Content Sections */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {sections.map((section, idx) => (
                                <Box key={idx}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#1976d2' }}>
                                        {t(section.titleKey)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#444',
                                            lineHeight: 1.8,
                                            textAlign: 'justify',
                                            whiteSpace: 'pre-line'
                                        }}
                                    >
                                        {t(section.contentKey, opts)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
