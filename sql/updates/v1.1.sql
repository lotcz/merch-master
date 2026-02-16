alter table design_file
    drop constraint fk60u1tkdlxsfyh8ca3hwvkt9ec;

alter table design_file
    add constraint fk_design_file_design_id
        foreign key (design_id) references design
            on delete cascade;
