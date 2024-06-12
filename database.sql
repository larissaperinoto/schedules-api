CREATE TABLE availabilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id CHAR(20) NOT NULL,    
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id CHAR(20) NOT NULL,
    client_id CHAR(20) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL
)