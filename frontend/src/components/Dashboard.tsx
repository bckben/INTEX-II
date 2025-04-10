import React, { useState } from 'react';
import './Dashboard.css';

const reportDescriptions: Record<string, string> = {
    report1: "Shows user age distribution for audience segmentation.",
    report2: "Displays how long content tends to be.",
    report3: "Shows how many genres are tagged per movie.",
    report4: "Top countries creating content.",
    report5: "Distribution of content release years.",
    report6: "Shows age breakdown by platform subscriptions.",
    report7: "Correlations between platform subscriptions.",
    report8: "Breakdown of content types (Movie vs TV).",
    report9: "Popularity of each streaming platform.",
    report10: "Which genres tend to be longest.",
    report11: "Genres most popular among users under 25.",
    report12: "Genres most popular among users over 50.",
    report13: "Genre preferences split by gender.",
    report14: "Top genres watched by platform (split into three parts: Netflix, Disney+, Prime)"
};

const reportOptions = [
    { id: 'report1', label: 'Report 1: User Age Distribution' },
    { id: 'report2', label: 'Report 2: Content Duration' },
    { id: 'report3', label: 'Report 3: Genre Count per Movie' },
    { id: 'report4', label: 'Report 4: Top Countries Producing Content' },
    { id: 'report5', label: 'Report 5: Release Year Distribution' },
    { id: 'report6', label: 'Report 6: Age by Platform (KDE Overlays)' },
    { id: 'report7', label: 'Report 7: Platform Subscription Correlation' },
    { id: 'report8', label: 'Report 8: Content Type Distribution' },
    { id: 'report9', label: 'Report 9: Most Popular Streaming Platforms' },
    { id: 'report10', label: 'Report 10: Average Duration by Genre' },
    { id: 'report11', label: 'Report 11: Top Genres Watched by Users Under 25' },
    { id: 'report12', label: 'Report 12: Top Genres Watched by Users Over 50' },
    { id: 'report13', label: 'Report 13: Top Genres Watched by Gender' },
    { id: 'report14', label: 'Report 14: Top Genres by Platform' }
];

const Dashboard: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string>('report1');

    const getImagePaths = (reportId: string): string[] => {
        if (reportId === 'report14') {
            return ['report14a.png', 'report14b.png', 'report14c.png'];
        }
        return [`${reportId}.png`];
    };

    const imagePaths = getImagePaths(selectedReport);

    return (
        <div className="dashboard-tab">
            <h2>Visual Report Dashboard</h2>

            <div className="dashboard-select">
                <label htmlFor="reportSelect">Select Report:</label>
                <select
                    id="reportSelect"
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                >
                    {reportOptions.map(report => (
                        <option key={report.id} value={report.id}>{report.label}</option>
                    ))}
                </select>
            </div>

            <div className="report-display">
                {imagePaths.map((path, index) => (
                    <img
                        key={index}
                        src={`/images/${path}`}
                        alt={selectedReport}
                        className="report-image"
                    />
                ))}

                <p className="report-description">
                    {reportDescriptions[selectedReport]}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;