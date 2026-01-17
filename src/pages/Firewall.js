import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import SubTabs from '../components/SubTabs';
import useUrlTab from '../hooks/useUrlTab';

const firewallTabs = [
    { id: 'traffic', label: 'Traffic Rules' },
    { id: 'ip', label: 'IP Management' },
    { id: 'geo', label: 'Geo-Blocking' },
];

const ruleTargets = [
    { value: 'GET', label: 'Query String (GET)' },
    { value: 'POST', label: 'Form Body (POST)' },
    { value: 'COOKIE', label: 'Cookies' },
    { value: 'USER_AGENT', label: 'User Agent' },
    { value: 'URL', label: 'Request URL' },
];

const COUNTRY_OPTIONS = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BV', name: 'Bouvet Island' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'CV', name: 'Cabo Verde' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CX', name: 'Christmas Island' },
    { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo, Democratic Republic of the' },
    { code: 'CK', name: 'Cook Islands' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: "Cote d'Ivoire" },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CW', name: 'Curacao' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czechia' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'TF', name: 'French Southern Territories' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GG', name: 'Guernsey' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HM', name: 'Heard Island and McDonald Islands' },
    { code: 'VA', name: 'Holy See' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IM', name: 'Isle of Man' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JE', name: 'Jersey' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: 'Korea, North' },
    { code: 'KR', name: 'Korea, South' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macao' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'MP', name: 'Northern Mariana Islands' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestine' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PN', name: 'Pitcairn' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RE', name: 'Reunion' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BL', name: 'Saint Barthelemy' },
    { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'MF', name: 'Saint Martin (French part)' },
    { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SX', name: 'Sint Maarten (Dutch part)' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UM', name: 'United States Minor Outlying Islands' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'VG', name: 'Virgin Islands (British)' },
    { code: 'VI', name: 'Virgin Islands (US)' },
    { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
];

const Firewall = () => {
    const [activeTab, setActiveTab] = useUrlTab({ tabs: firewallTabs, defaultTab: 'ip' });
    const [blockedIps, setBlockedIps] = useState([]);
    const [allowedIps, setAllowedIps] = useState([]);
    const [ipListType, setIpListType] = useState('block');
    const [isIpLoading, setIsIpLoading] = useState(true);
    const [ipAddress, setIpAddress] = useState('');
    const [reason, setReason] = useState('');
    const [ipErrorMessage, setIpErrorMessage] = useState('');
    const [isIpSaving, setIsIpSaving] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const [rules, setRules] = useState([]);
    const [isRulesLoading, setIsRulesLoading] = useState(true);
    const [rulesErrorMessage, setRulesErrorMessage] = useState('');
    const [isRuleSaving, setIsRuleSaving] = useState(false);
    const [togglingRuleId, setTogglingRuleId] = useState(null);
    const [ruleForm, setRuleForm] = useState({ description: '', target_area: 'GET', pattern: '' });

    const [blockedCountries, setBlockedCountries] = useState([]);
    const [isGeoLoading, setIsGeoLoading] = useState(true);
    const [isGeoSaving, setIsGeoSaving] = useState(false);
    const [geoErrorMessage, setGeoErrorMessage] = useState('');

    const countryOptions = useMemo(() => {
        return [...COUNTRY_OPTIONS].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const fetchIpLists = useCallback(async () => {
        setIsIpLoading(true);
        setIpErrorMessage('');
        try {
            const [blockData, allowData] = await Promise.all([
                apiFetch({ path: '/saman-security/v1/firewall/ips?list=block' }),
                apiFetch({ path: '/saman-security/v1/firewall/ips?list=allow' }),
            ]);
            setBlockedIps(Array.isArray(blockData) ? blockData : []);
            setAllowedIps(Array.isArray(allowData) ? allowData : []);
        } catch (error) {
            setIpErrorMessage(error?.message || 'Unable to load IP lists.');
        } finally {
            setIsIpLoading(false);
        }
    }, []);

    const fetchRules = useCallback(async () => {
        setIsRulesLoading(true);
        setRulesErrorMessage('');
        try {
            const data = await apiFetch({ path: '/saman-security/v1/firewall/rules' });
            setRules(Array.isArray(data) ? data : []);
        } catch (error) {
            setRulesErrorMessage(error?.message || 'Unable to load firewall rules.');
        } finally {
            setIsRulesLoading(false);
        }
    }, []);

    const fetchCountries = useCallback(async () => {
        setIsGeoLoading(true);
        setGeoErrorMessage('');
        try {
            const data = await apiFetch({ path: '/saman-security/v1/firewall/countries' });
            setBlockedCountries(Array.isArray(data) ? data : []);
        } catch (error) {
            setGeoErrorMessage(error?.message || 'Unable to load blocked countries.');
        } finally {
            setIsGeoLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIpLists();
        fetchRules();
        fetchCountries();
    }, [fetchIpLists, fetchRules, fetchCountries]);

    const formatDate = (dateString) => {
        if (!dateString) {
            return '—';
        }

        const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }

        return parsed.toLocaleString();
    };

    const addIp = async () => {
        if (!ipAddress.trim()) {
            setIpErrorMessage('Enter an IP address.');
            return;
        }

        setIsIpSaving(true);
        setIpErrorMessage('');
        try {
            await apiFetch({
                path: '/saman-security/v1/firewall/ips',
                method: 'POST',
                data: {
                    ip: ipAddress.trim(),
                    reason: reason.trim(),
                    list_type: ipListType,
                },
            });
            setIpAddress('');
            setReason('');
            await fetchIpLists();
        } catch (error) {
            setIpErrorMessage(error?.message || 'Unable to save this IP address.');
        } finally {
            setIsIpSaving(false);
        }
    };

    const removeIp = async (id) => {
        setRemovingId(id);
        setIpErrorMessage('');
        try {
            await apiFetch({
                path: `/saman-security/v1/firewall/ips/${id}`,
                method: 'DELETE',
            });
            await fetchIpLists();
        } catch (error) {
            setIpErrorMessage(error?.message || 'Unable to remove this IP address.');
        } finally {
            setRemovingId(null);
        }
    };

    const addRule = async () => {
        if (!ruleForm.description.trim() || !ruleForm.pattern.trim()) {
            setRulesErrorMessage('Provide a description and regex pattern for the rule.');
            return;
        }

        setIsRuleSaving(true);
        setRulesErrorMessage('');
        try {
            await apiFetch({
                path: '/saman-security/v1/firewall/rules',
                method: 'POST',
                data: {
                    description: ruleForm.description.trim(),
                    target_area: ruleForm.target_area,
                    pattern: ruleForm.pattern.trim(),
                },
            });
            setRuleForm({ description: '', target_area: 'GET', pattern: '' });
            await fetchRules();
        } catch (error) {
            setRulesErrorMessage(error?.message || 'Unable to create firewall rule.');
        } finally {
            setIsRuleSaving(false);
        }
    };

    const toggleRule = async (rule) => {
        setTogglingRuleId(rule.id);
        setRulesErrorMessage('');
        try {
            await apiFetch({
                path: `/saman-security/v1/firewall/rules/${rule.id}`,
                method: 'PUT',
                data: {
                    is_active: !rule.is_active,
                },
            });
            await fetchRules();
        } catch (error) {
            setRulesErrorMessage(error?.message || 'Unable to update rule status.');
        } finally {
            setTogglingRuleId(null);
        }
    };

    const handleCountryChange = (event) => {
        const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
        setBlockedCountries(selected);
    };

    const saveCountries = async () => {
        setIsGeoSaving(true);
        setGeoErrorMessage('');
        try {
            await apiFetch({
                path: '/saman-security/v1/firewall/countries',
                method: 'POST',
                data: {
                    countries: blockedCountries,
                },
            });
        } catch (error) {
            setGeoErrorMessage(error?.message || 'Unable to save blocked countries.');
        } finally {
            setIsGeoSaving(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Firewall</h1>
                    <p>Inspect incoming traffic, manage IP access, and apply geo rules.</p>
                </div>
                <button type="button" className="button ghost">Review Rule Sets</button>
            </div>

            <SubTabs tabs={firewallTabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Firewall sections" />

            <section className="panel">
                {activeTab === 'ip' ? (
                    <>
                        <div className="table-toolbar">
                            <div>
                                <h3>IP Management</h3>
                                <p className="muted">Track blocked and trusted addresses.</p>
                            </div>
                            <div className="inline-form">
                                <input
                                    type="text"
                                    placeholder="IP Address"
                                    value={ipAddress}
                                    onChange={(event) => setIpAddress(event.target.value)}
                                    disabled={isIpSaving}
                                />
                                <input
                                    type="text"
                                    placeholder="Reason"
                                    value={reason}
                                    onChange={(event) => setReason(event.target.value)}
                                    disabled={isIpSaving}
                                />
                                <select
                                    value={ipListType}
                                    onChange={(event) => setIpListType(event.target.value)}
                                    disabled={isIpSaving}
                                >
                                    <option value="block">Blocklist</option>
                                    <option value="allow">Allowlist</option>
                                </select>
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={addIp}
                                    disabled={isIpSaving}
                                >
                                    {isIpSaving ? 'Saving...' : `Add to ${ipListType === 'allow' ? 'Allowlist' : 'Blocklist'}`}
                                </button>
                                {ipErrorMessage ? <p className="form-error">{ipErrorMessage}</p> : null}
                            </div>
                        </div>
                        <div>
                            <h4>Blocked IPs</h4>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Reason</th>
                                        <th>Date Added</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isIpLoading ? (
                                        <tr>
                                            <td colSpan="4">Loading blocked IPs...</td>
                                        </tr>
                                    ) : blockedIps.length ? (
                                        blockedIps.map((entry) => (
                                            <tr key={entry.id}>
                                                <td>{entry.ip_address}</td>
                                                <td>{entry.reason || '—'}</td>
                                                <td>{formatDate(entry.created_at)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="link-button"
                                                        onClick={() => removeIp(entry.id)}
                                                        disabled={removingId === entry.id}
                                                    >
                                                        {removingId === entry.id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No blocked IPs yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4>Allowed IPs</h4>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Reason</th>
                                        <th>Date Added</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isIpLoading ? (
                                        <tr>
                                            <td colSpan="4">Loading allowed IPs...</td>
                                        </tr>
                                    ) : allowedIps.length ? (
                                        allowedIps.map((entry) => (
                                            <tr key={entry.id}>
                                                <td>{entry.ip_address}</td>
                                                <td>{entry.reason || '—'}</td>
                                                <td>{formatDate(entry.created_at)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="link-button"
                                                        onClick={() => removeIp(entry.id)}
                                                        disabled={removingId === entry.id}
                                                    >
                                                        {removingId === entry.id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No allowed IPs yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : null}

                {activeTab === 'traffic' ? (
                    <>
                        <div className="table-toolbar">
                            <div>
                                <h3>Traffic Rules</h3>
                                <p className="muted">Inspect incoming requests for malicious patterns.</p>
                            </div>
                            <div className="inline-form">
                                <input
                                    type="text"
                                    placeholder="Rule description"
                                    value={ruleForm.description}
                                    onChange={(event) => setRuleForm((prev) => ({ ...prev, description: event.target.value }))}
                                    disabled={isRuleSaving}
                                />
                                <select
                                    value={ruleForm.target_area}
                                    onChange={(event) => setRuleForm((prev) => ({ ...prev, target_area: event.target.value }))}
                                    disabled={isRuleSaving}
                                >
                                    {ruleTargets.map((target) => (
                                        <option key={target.value} value={target.value}>{target.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Regex pattern"
                                    value={ruleForm.pattern}
                                    onChange={(event) => setRuleForm((prev) => ({ ...prev, pattern: event.target.value }))}
                                    disabled={isRuleSaving}
                                />
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={addRule}
                                    disabled={isRuleSaving}
                                >
                                    {isRuleSaving ? 'Adding...' : 'Add Rule'}
                                </button>
                                {rulesErrorMessage ? <p className="form-error">{rulesErrorMessage}</p> : null}
                            </div>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Target</th>
                                    <th>Pattern</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isRulesLoading ? (
                                    <tr>
                                        <td colSpan="4">Loading firewall rules...</td>
                                    </tr>
                                ) : rules.length ? (
                                    rules.map((rule) => (
                                        <tr key={rule.id}>
                                            <td>{rule.description}</td>
                                            <td>{rule.target_area}</td>
                                            <td><span className="code">{rule.pattern}</span></td>
                                            <td>
                                                <label className="toggle">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!rule.is_active}
                                                        onChange={() => toggleRule(rule)}
                                                        disabled={togglingRuleId === rule.id}
                                                    />
                                                    <span className="toggle-track" />
                                                    <span className="toggle-text">{rule.is_active ? 'Active' : 'Paused'}</span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No rules available yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : null}

                {activeTab === 'geo' ? (
                    <>
                        <div>
                            <h3>Geo-Blocking</h3>
                            <p className="muted">Block traffic based on country of origin.</p>
                        </div>
                        <div className="settings-form">
                            <div className="settings-row">
                                <div className="settings-label">
                                    <label htmlFor="blocked-countries">Blocked Countries</label>
                                    <p className="settings-help">Select the countries to block from accessing your site.</p>
                                </div>
                                <div className="settings-control">
                                    <select
                                        id="blocked-countries"
                                        multiple
                                        value={blockedCountries}
                                        onChange={handleCountryChange}
                                        disabled={isGeoLoading || isGeoSaving}
                                    >
                                        {countryOptions.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.name} ({country.code})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="muted">{blockedCountries.length} countries blocked.</p>
                                </div>
                            </div>
                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="button primary"
                                    onClick={saveCountries}
                                    disabled={isGeoSaving}
                                >
                                    {isGeoSaving ? 'Saving...' : 'Save Geo Rules'}
                                </button>
                                {geoErrorMessage ? <p className="form-error">{geoErrorMessage}</p> : null}
                            </div>
                        </div>
                    </>
                ) : null}
            </section>
        </div>
    );
};

export default Firewall;
