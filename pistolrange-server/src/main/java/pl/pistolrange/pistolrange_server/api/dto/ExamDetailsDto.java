package pl.pistolrange.pistolrange_server.api.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamDetailsDto {
    private int examDuration;
    private int goodAnswersToPass;
    private int answersCount;
}
