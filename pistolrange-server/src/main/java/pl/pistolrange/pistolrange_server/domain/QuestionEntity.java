package pl.pistolrange.pistolrange_server.domain;

import jakarta.persistence.*;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "questions")
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String databaseId;

    @Column(name = "legacy_id")
    private String legacyId;

    @Column(name = "question_value", nullable = false, length = 4000)
    private String questionValue;

    @Column(name = "good_answer", nullable = false)
    private String goodAnswer;

    @Column(name = "paragraph")
    private String paragraph;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private WeaponLawCategory category;

    @Column(name = "a_answer", nullable = false, length = 4000)
    private String a_answer;

    @Column(name = "b_answer", nullable = false, length = 4000)
    private String b_answer;

    @Column(name = "c_answer", nullable = false, length = 4000)
    private String c_answer;
}
