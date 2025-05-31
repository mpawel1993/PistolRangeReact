package pl.pistolrange.pistolrange_server.domain;

import jakarta.persistence.*;
import lombok.*;


@Entity(name = "EXAM_DETAILS")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamEntity {

    @Id
    private String id;
    private int examDuration;
    private int goodAnswersToPass;
    private int answersCount;
}
